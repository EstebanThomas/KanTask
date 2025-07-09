'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useParams} from "next/navigation";
import { useRouter } from 'next/navigation';

import AddCardPopup from "../../../components/AddCardPopup";
import RenameListPopup from "../../../components/RenameListPopup";
import ConfirmDeletePopup from "../../../components/ConfirmDeletePopup";
import EditCardPopup from "../../../components/EditCardPopup";
import ConfirmDeleteCard from '../../../components/ConfirmDeleteCard';

export default function Project() {

    const { id } = useParams();
    const [project, setProject] = useState(null);

    const [user, setUser] = useState({});
    const router = useRouter();

    const account = () => {
        router.push(`/account/${user.id}`);
    };

    const projects = () => {
        router.push(`/projects/${user.id}`);
    };

    const signout = async () => {
        await fetch("/api/signout", {
        method: "POST",
        credentials: "include",
        });
        router.push("/");
    };

    const [columns, setColumns] = useState({

    });

    const [columnOrder, setColumnOrder] = useState([

    ]);

    const [popup, setPopup] = useState(null);

    const getCard = (columnId, cardId) => {
        const column = columns[columnId];
        if (!column) return null;
        return column.items.find(card => card._id === cardId) || null;
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === "COLUMN") {
            const newOrder = Array.from(columnOrder);
            const [removed] = newOrder.splice(source.index, 1);
            newOrder.splice(destination.index, 0, removed);
            setColumnOrder(newOrder);

            // Save list order
            await fetch(`/api/project/${id}/lists/order`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newOrder })
            });
        } else {
            const sourceCol = columns[source.droppableId];
            const destCol = columns[destination.droppableId];
            const sourceItems = [...sourceCol.items];
            const destItems = [...destCol.items];
            const [moved] = sourceItems.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                sourceItems.splice(destination.index, 0, moved);
                setColumns(prev => ({
                    ...prev,
                    [source.droppableId]: { ...sourceCol, items: sourceItems }
                }));
            } else {
                destItems.splice(destination.index, 0, moved);
                setColumns(prev => ({
                    ...prev,
                    [source.droppableId]: { ...sourceCol, items: sourceItems },
                    [destination.droppableId]: { ...destCol, items: destItems }
                }));
            }

            // Update position
            await fetch(`/api/project/${id}/cards/move`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cardId: moved._id,
                    fromListId: source.droppableId,
                    toListId: destination.droppableId,
                    newIndex: destination.index
                })
            });
        }
    };


    const handleAddCard = async (listId, cardTitle) => {
        const res = await fetch(`/api/project/${id}/lists/${listId}/cards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: cardTitle, description: "" })
        });
        const newCard = await res.json();

        setColumns(prev => ({
            ...prev,
            [listId]: {
                ...prev[listId],
                items: [...prev[listId].items, newCard]
            }
        }));
        setPopup(null);
    };


    const handleRenameList = async (listId, newName) => {
        if (!listId) {
            // Add new list
            const res = await fetch(`/api/project/${id}/lists`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName })
            });
            const newList = await res.json();
            setColumns(prev => ({
                ...prev,
                [newList._id]: { name: newList.name, items: [] }
            }));
            setColumnOrder(prev => [...prev, newList._id]);
        } else {
            // Rename list
            await fetch(`/api/project/${id}/lists/${listId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName })
            });
            setColumns(prev => ({
                ...prev,
                [listId]: { ...prev[listId], name: newName }
            }));
        }
        setPopup(null);
    };


    const handleDeleteList = async (listId) => {
        await fetch(`/api/project/${id}/lists/${listId}`, {
            method: "DELETE"
        });

        setColumns(prev => {
            const newColumns = { ...prev };
            delete newColumns[listId];
            return newColumns;
        });
        setColumnOrder(prev => prev.filter(colId => colId !== listId));
        setPopup(null);
    };


    const handleEditCard = async (listId, updatedCard) => {
        await fetch(`/api/project/${id}/lists/${listId}/cards/${updatedCard._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCard)
        });

        setColumns(prev => ({
            ...prev,
            [listId]: {
                ...prev[listId],
                items: prev[listId].items.map(card =>
                    card._id === updatedCard._id ? updatedCard : card
                )
            }
        }));
        setPopup(null);
    };

    const handleDeleteCard = async (listId, cardId) => {
        await fetch(`/api/project/${id}/lists/${listId}/cards/${cardId}`, {
            method: "DELETE"
        });
        setColumns(prev => ({
            ...prev,
            [listId]: {
                ...prev[listId],
                items: prev[listId].items.filter(card => card._id !== cardId)
            }
        }));
        setPopup(null);
    };

    useEffect(() => {
        async function fetchProject() {
            try {
                const res = await fetch(`/api/project/${id}`);
                if (!res.ok) {
                    console.error("API error:", errorData.error);
                    return;
                }
                const data = await res.json();
                setProject(data);
            } catch (err) {
                console.error("Error loading project", err);
            }
        }

        fetchProject();
    }, [id]);

    useEffect(() => {
        if (project) {
            const columnsData = {};
            const order = [];

            if (project?.lists?.length) {
                project.lists.forEach(list => {
                    columnsData[list._id] = {
                        name: list.name,
                        items: list.cards
                    };
                    order.push(list._id);
                });
            };

            setColumns(columnsData);
            setColumnOrder(order);
        }
    }, [project]);

    if (!project) return <div className='text-center text-2xl'>Loading...</div>;

    return (
        <div className="flex flex-col h-screen">

            {/* HEADER */}
            <div className='flex flex-col md:flex-row gap-0 md:gap-5'>
                <div className="flex justify-center md:justify-start items-center">
                    <Link href="/">
                        <Image
                            src="/LogoKanTaskSansFond.svg"
                            alt="Logo de l'application"
                            width={500}
                            height={300}
                            priority
                            className="w-50 md:w-75 xl:w-80 h-auto"
                        />
                    </Link>
                </div>
                <div className='flex flex-1 justify-center items-center gap-10 mt-5'>
                    <button title='HOME'>
                        <Link href="/">
                            <Image src="/Home.svg" alt="Home" width={50} height={50} className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50" />
                        </Link>
                    </button>
                    <button title='SIGN OUT' onClick={signout}>
                            <Image src="/Sign.svg" alt="Sign out" width={50} height={50} className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50" />
                    </button>
                    <button title='ACCOUNT' onClick={account}>
                            <Image src="/User.svg" alt="Modify account" width={50} height={50} className="w-12 md:w-18 h-autohover:bg-bg hover:opacity-50" />
                    </button>
                    <button title='PROJECTS' onClick={projects}>
                            <Image src="/Projects.svg" alt="Project manager" width={50} height={50} className="w-12 md:w-18 h-autohover:bg-bg hover:opacity-50" />
                    </button>
                </div>
            </div>

            {/* BOARD */}
            <div id="board" className="board flex-1 p-4 pt-2 overflow-y-auto">

                <div className='flex justify-between items-center gap-10 overflow-x-auto whitespace-nowrap p-1'>
                    <h1 className='text-white text-2xl font-bold'>{project.title}</h1>                    
                    <button onClick={() => setPopup({ type: "renameList", columnId: null })} className="hover:bg-primary hover:opacity-65 rounded-xl" title='Add list'>
                        <Image
                            src="/AddDark.svg"
                            alt="Add list"
                            width={50}
                            height={50}
                            className="w-15 h-auto"
                        />
                    </button>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div
                                className="flex gap-4 overflow-x-auto h-auto p-2"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {columnOrder.map((columnId, index) => {
                                    const column = columns[columnId];
                                    if (!column) return null;

                                    return (
                                        <Draggable draggableId={columnId} index={index} key={columnId}>
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    className="w-60 p-3 bg-bg rounded shadow-lg min-w-60 h-full max-h-145 overflow-y-auto"
                                                >
                                                    <div className="flex justify-between items-center mb-2 group">
                                                        <h2 className="text-lg font-merriweather font-bold"><strong>{column.name}</strong></h2>
                                                        <div className="flex gap-1 actions">
                                                            <button
                                                                onClick={() => setPopup({ type: "renameList", columnId })}
                                                                className="text-sm text-white px-1 rounded hover:bg-bg hover:opacity-65"
                                                                title="Rename list"
                                                            >
                                                                <Image
                                                                    src="/Edit.svg"
                                                                    alt="Rename list"
                                                                    width={50}
                                                                    height={50}
                                                                    className="w-10 h-auto object-contain"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() => setPopup({ type: "deleteList", columnId })}
                                                                className="text-sm text-white px-1 rounded hover:bg-bg hover:opacity-65"
                                                                title="Delete list"
                                                            >
                                                                <Image
                                                                    src="/Close.svg"
                                                                    alt="Delete list"
                                                                    width={50}
                                                                    height={50}
                                                                    className="w-10 h-auto object-contain"
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <Droppable droppableId={columnId} type="CARDS">
                                                        {(provided) => (
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className="min-h-[100px] p-2 rounded"
                                                            >                                                               
                                                                {column.items.map((item, index) => (
                                                                    <Draggable 
                                                                        key={item._id.toString()} 
                                                                        draggableId={item._id.toString()} 
                                                                        index={index}
                                                                    >
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="p-2 mb-2 bg-white rounded shadow hover:shadow-xl group"
                                                                            >
                                                                                <strong className='overflow-hidden flex flex-wrap'>{item.title}</strong>
                                                                                <p className="text-sm overflow-hidden flex flex-wrap">{item.description}</p>
                                                                                <div className="flex gap-2 mt-1 actions">
                                                                                    <button
                                                                                        onClick={() => setPopup({ type: "editCard", columnId, cardId: item._id })}
                                                                                        className="text-blue-600 hover:bg-white hover:opacity-65"
                                                                                        title="Edit card"
                                                                                    >
                                                                                        <Image
                                                                                            src="/Edit.svg"
                                                                                            alt="Edit card"
                                                                                            width={50}
                                                                                            height={50}
                                                                                            className="w-8 h-auto object-contain"
                                                                                        />
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setPopup({ type: "deleteCard", columnId, cardId: item._id })}
                                                                                        className="text-red-600 hover:bg-white hover:opacity-65"
                                                                                        title="Delete card"
                                                                                    >
                                                                                        <Image
                                                                                            src="/Close.svg"
                                                                                            alt="Delete card"
                                                                                            width={50}
                                                                                            height={50}
                                                                                            className="w-8 h-auto object-contain"
                                                                                        />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                                <button
                                                                    onClick={() => setPopup({ type: "addCard", columnId })}
                                                                    className="mt-2 w-full flex justify-center items-center rounded py-1 hover:bg-bg hover:opacity-50"
                                                                    title='Add card'
                                                                >
                                                                    <Image
                                                                        src="/Add.svg"
                                                                        alt="Delete card"
                                                                        width={50}
                                                                        height={50}
                                                                        className="w-12 h-auto object-contain"
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </Droppable>
                                                </div>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Popups */}
            {popup?.type === "addCard" && (
                <AddCardPopup
                    onClose={() => setPopup(null)}
                    onAdd={(cardTitle) => handleAddCard(popup.columnId, cardTitle)}
                />
            )}
            {popup?.type === "renameList" && (
                <RenameListPopup
                    onClose={() => setPopup(null)}
                    onRename={(newName) => handleRenameList(popup.columnId, newName)}
                    currentName={popup.columnId && columns[popup.columnId] ? columns[popup.columnId].name : ""}
                />
            )}
            {popup?.type === "deleteList" && (
                <ConfirmDeletePopup
                    onClose={() => setPopup(null)}
                    onDelete={() => handleDeleteList(popup.columnId)}
                >
                    <p>Do you really want to delete this list?</p>
                </ConfirmDeletePopup>
            )}

            {popup?.type === "editCard" && (
                <EditCardPopup
                    task={getCard(popup.columnId, popup.cardId)}
                    onClose={() => setPopup(null)}
                    onSave={(updatedCard) => handleEditCard(popup.columnId, updatedCard)}
                />
            )}

            {popup?.type === "deleteCard" && (
                <ConfirmDeleteCard
                    onClose={() => setPopup(null)}
                    onDelete={() => handleDeleteCard(popup.columnId, popup.cardId)}
                >
                    <p>Are you sure you want to delete this card?</p>
                </ConfirmDeleteCard>
            )}
        </div>
    );
}
