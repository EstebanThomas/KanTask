'use client';

import { useState } from "react";
import Popup from "./Popup";

export default function AddCardPopup({ onClose, onAdd }) {
    const [taskName, setTaskName] = useState("");

    return (
    <Popup
        title="Add card"
        onClose={onClose}
        onConfirm={() => {
        if (taskName.trim()) {
            onAdd(taskName);
            setTaskName("");
        }
        }}
    >
        <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Card name"
        className="border w-full p-2 rounded"
        />
    </Popup>
    );
}
