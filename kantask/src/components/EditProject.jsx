// components/EditProjectPopup.jsx
"use client";

import { useState } from 'react';

export default function EditProjectPopup({ onClose, onSave, currentTitle }) {
    const [newTitle, setNewTitle] = useState(currentTitle || '');
    const [error, setError] = useState('');

    const handleSave = () => {
    const sanitized = newTitle.replace(/<[^>]*>?/gm, '').trim();

    if (sanitized.length === 0) {
        setError("Title cannot be empty.");
        return;
    }

    if (sanitized.length > 25) {
        setError("The title cannot exceed 25 characters.");
        return;
    }

    setError('');
    onSave(sanitized);
    onClose();
    };

    return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-5 rounded shadow w-80">
            <h2 className="text-xl text-center mb-4">EDIT PROJECT</h2>
            <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                maxLength={100}
                placeholder="New project title"
            />
            {error && <p className="text-error text-sm mb-2">{error}</p>}
            <div className="flex justify-center items-center gap-2 mt-2">
                <button onClick={onClose} className="bg-gray px-3 py-1 rounded hover:shadow-xl">Cancel</button>
                <button onClick={handleSave} className="bg-success text-white px-3 py-1 rounded hover:shadow-xl">Save</button>
            </div>
        </div>
    </div>
    );
}
