'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

import AddCardPopup from "../../components/AddCardPopup";
import RenameListPopup from "../../components/RenameListPopup";
import ConfirmDeletePopup from "../../components/ConfirmDeletePopup";
import EditCardPopup from "../../components/EditCardPopup";

export default function Project() {

    const [columns, setColumns] = useState({
        backlog: { name: "Backlog", items: [] },
        todo: {
            name: "To do",
            items: [
                { id: "1", title: "Card 1", description: "Description of card 1" },
                { id: "2", title: "Card 2", description: "Description of card 2" }
            ]
        },
        doing: { name: "Doing", items: [{ id: "3", title: "Card 3", description: "Description of card 3" }] },
        testing: { name: "Testing", items: [] },
        done: { name: "Done", items: [] },
    });

    const [columnOrder, setColumnOrder] = useState([
        "backlog",
        "todo",
        "doing",
        "testing",
        "done",
    ]);

    // Popup peut contenir différents types, avec info sur liste et tâche
    // ex : { type: "editTask", columnId, taskId }
    const [popup, setPopup] = useState(null);

    // Fonction pour récupérer une tâche depuis columnId + taskId
    const getTask = (columnId, taskId) => {
        const column = columns[columnId];
        if (!column) return null;
        return column.items.find(task => task.id === taskId) || null;
    };

    // Gestion du drag & drop
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === "COLUMN") {
            // Réordonner les colonnes
            const newColumnOrder = Array.from(columnOrder);
            const [removed] = newColumnOrder.splice(source.index, 1);
            newColumnOrder.splice(destination.index, 0, removed);
            setColumnOrder(newColumnOrder);
        } else {
            // Déplacer les tâches
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);

            if (source.droppableId === destination.droppableId) {
                sourceItems.splice(destination.index, 0, removed);
                setColumns({
                    ...columns,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems,
                    },
                });
            } else {
                destItems.splice(destination.index, 0, removed);
                setColumns({
                    ...columns,
                    [source.droppableId]: {
                        ...sourceColumn,
                        items: sourceItems,
                    },
                    [destination.droppableId]: {
                        ...destColumn,
                        items: destItems,
                    },
                });
            }
        }
    };

    // Ajouter une tâche (avec titre uniquement, description vide par défaut)
    const handleAddTask = (listId, taskTitle) => {
        const newTask = { id: Date.now().toString(), title: taskTitle, description: "" };
        setColumns({
            ...columns,
            [listId]: {
                ...columns[listId],
                items: [...columns[listId].items, newTask],
            },
        });
        setPopup(null);
    };

    // Renommer une liste ou en créer une nouvelle
    const handleRenameList = (listId, newName) => {
        if (!listId) {
            // Créer nouvelle liste
            const newId = Date.now().toString();
            setColumns({
                ...columns,
                [newId]: { name: newName, items: [] },
            });
            setColumnOrder([...columnOrder, newId]);
        } else {
            setColumns({
                ...columns,
                [listId]: { ...columns[listId], name: newName },
            });
        }
        setPopup(null);
    };

    // Supprimer une liste
    const handleDeleteList = (listId) => {
        const newColumns = { ...columns };
        delete newColumns[listId];
        setColumns(newColumns);

        setColumnOrder(columnOrder.filter(id => id !== listId));

        setPopup(null);
    };

    // Modifier une tâche (titre + description)
    const handleEditTask = (columnId, updatedTask) => {
        setColumns(prev => {
            const column = prev[columnId];
            if (!column) return prev;
            const newItems = column.items.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            );
            return {
                ...prev,
                [columnId]: {
                    ...column,
                    items: newItems,
                },
            };
        });
        setPopup(null);
    };

    // Supprimer une tâche
    const handleDeleteTask = (columnId, taskId) => {
        setColumns(prev => {
            const column = prev[columnId];
            if (!column) return prev;
            return {
                ...prev,
                [columnId]: {
                    ...column,
                    items: column.items.filter(task => task.id !== taskId),
                },
            };
        });
        setPopup(null);
    };

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
                    <button title='SIGN OUT'>
                        <Link href="/">
                            <Image src="/Sign.svg" alt="Sign out" width={50} height={50} className="w-12 md:w-18 h-auto hover:bg-bg hover:opacity-50" />
                        </Link>
                    </button>
                    <button title='ACCOUNT'>
                        <Link href="/account">
                            <Image src="/User.svg" alt="Modify account" width={50} height={50} className="w-12 md:w-18 h-autohover:bg-bg hover:opacity-50" />
                        </Link>
                    </button>
                    <button title='PROJECTS'>
                        <Link href="/projects">
                            <Image src="/Projects.svg" alt="Project manager" width={50} height={50} className="w-12 md:w-18 h-autohover:bg-bg hover:opacity-50" />
                        </Link>
                    </button>
                </div>
            </div>

            {/* BOARD */}
            <div id="board" className="board flex-1 p-4 pt-2 overflow-y-auto">

                <div className='flex justify-between items-center gap-10 overflow-x-auto whitespace-nowrap p-1'>
                    <h1 className='text-white text-2xl font-bold'>TITLE</h1>                    
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
                                    if (!column) return null; // sécurité si colonne supprimée

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

                                                    <Droppable droppableId={columnId} type="TASK">
                                                        {(provided) => (
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className="min-h-[100px] p-2 rounded"
                                                            >
                                                                {column.items.map((item, index) => (
                                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
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
                                                                                        onClick={() => setPopup({ type: "editCard", columnId, taskId: item.id })}
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
                                                                                        onClick={() => setPopup({ type: "deleteCard", columnId, taskId: item.id })}
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
                    onAdd={(taskTitle) => handleAddTask(popup.columnId, taskTitle)}
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
                    task={getTask(popup.columnId, popup.taskId)}
                    onClose={() => setPopup(null)}
                    onSave={(updatedTask) => handleEditTask(popup.columnId, updatedTask)}
                />
            )}

            {popup?.type === "deleteCard" && (
                <ConfirmDeletePopup
                    onClose={() => setPopup(null)}
                    onDelete={() => handleDeleteTask(popup.columnId, popup.taskId)}
                >
                    <p>Are you sure you want to delete this card?</p>
                </ConfirmDeletePopup>
            )}

        </div>
    );
}
