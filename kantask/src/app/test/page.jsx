'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

import AddTaskPopup from "../../components/AddCardPopup";
import RenameListPopup from "../../components/RenameListPopup";
import ConfirmDeletePopup from "../../components/ConfirmDeletePopup";
import EditTaskPopup from "../../components/EditCardPopup";

export default function Project() {

    const [columns, setColumns] = useState({
        backlog: { name: "Backlog", items: [] },
        todo: {
            name: "To do",
            items: [
                { id: "1", title: "Tâche 1", description: "Description de la tâche 1" },
                { id: "2", title: "Tâche 2", description: "Description de la tâche 2" }
            ]
        },
        doing: { name: "Doing", items: [{ id: "3", title: "Tâche 3", description: "Description de la tâche 3" }] },
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
                            <Image src="/Home.svg" alt="Home" width={50} height={50} className="w-12 md:w-18 h-auto" />
                        </Link>
                    </button>
                    <button title='SIGN OUT'>
                        <Link href="/">
                            <Image src="/Sign.svg" alt="Sign out" width={50} height={50} className="w-12 md:w-18 h-auto" />
                        </Link>
                    </button>
                    <button title='ACCOUNT'>
                        <Link href="/account">
                            <Image src="/User.svg" alt="Modify account" width={50} height={50} className="w-12 md:w-18 h-auto" />
                        </Link>
                    </button>
                    <button title='PROJECTS'>
                        <Link href="/projects">
                            <Image src="/Projects.svg" alt="Project manager" width={50} height={50} className="w-12 md:w-18 h-auto" />
                        </Link>
                    </button>
                </div>
            </div>

            {/* BOARD */}
            <div id="board" className="board flex-1 p-4">
                <button onClick={() => setPopup({ type: "renameList", columnId: null })} className="p-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600">
                    ➕ Créer une liste
                </button>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                        {(provided) => (
                            <div
                                className="flex gap-4 overflow-x-auto"
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
                                                    className="w-64 p-3 bg-gray-100 rounded shadow"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h2 className="text-lg font-bold">{column.name}</h2>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => setPopup({ type: "renameList", columnId })}
                                                                className="text-sm bg-blue-400 text-white px-1 rounded"
                                                                title="Renommer la liste"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => setPopup({ type: "deleteList", columnId })}
                                                                className="text-sm bg-red-400 text-white px-1 rounded"
                                                                title="Supprimer la liste"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <Droppable droppableId={columnId} type="TASK">
                                                        {(provided) => (
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                                className="min-h-[100px] p-2 bg-white rounded shadow"
                                                            >
                                                                {column.items.map((item, index) => (
                                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                        {(provided) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="p-2 mb-2 bg-blue-200 rounded"
                                                                            >
                                                                                <strong>{item.title}</strong>
                                                                                <p className="text-sm">{item.description}</p>
                                                                                <div className="flex gap-2 mt-1">
                                                                                    <button
                                                                                        onClick={() => setPopup({ type: "editTask", columnId, taskId: item.id })}
                                                                                        className="text-blue-600"
                                                                                        title="Modifier la tâche"
                                                                                    >
                                                                                        ✏️
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => setPopup({ type: "deleteTask", columnId, taskId: item.id })}
                                                                                        className="text-red-600"
                                                                                        title="Supprimer la tâche"
                                                                                    >
                                                                                        🗑️
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                                <button
                                                                    onClick={() => setPopup({ type: "addTask", columnId })}
                                                                    className="mt-2 w-full bg-green-300 text-black rounded py-1 hover:bg-green-400"
                                                                >
                                                                    ➕ Ajouter une tâche
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
            {popup?.type === "addTask" && (
                <AddTaskPopup
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
                    <p>Voulez-vous vraiment supprimer cette liste ?</p>
                </ConfirmDeletePopup>
            )}

            {popup?.type === "editTask" && (
                <EditTaskPopup
                    task={getTask(popup.columnId, popup.taskId)}
                    onClose={() => setPopup(null)}
                    onSave={(updatedTask) => handleEditTask(popup.columnId, updatedTask)}
                />
            )}

            {popup?.type === "deleteTask" && (
                <ConfirmDeletePopup
                    onClose={() => setPopup(null)}
                    onDelete={() => handleDeleteTask(popup.columnId, popup.taskId)}
                >
                    <p>Voulez-vous vraiment supprimer cette tâche ?</p>
                </ConfirmDeletePopup>
            )}

        </div>
    );
}
