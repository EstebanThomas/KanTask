import { useState, useEffect } from "react";

export default function EditCardPopup({ onClose, onSave, task }) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");

    useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    }, [task]);

    const handleSubmit = () => {
    if(title.trim() === "") {
        alert("The title is required");
        return;
    }
    onSave({ ...task, title, description });
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded p-6 w-80">
        <h2 className="text-lg mb-4">Edit card</h2>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
        />
        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
            rows={4}
        />
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleSubmit} className="px-3 py-1 bg-success text-white rounded">Save</button>
        </div>
        </div>
    </div>
    );
}
