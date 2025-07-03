'use client';

import { useState } from "react";
import Popup from "./Popup";

export default function RenameListPopup({ onClose, onRename, currentName }) {
    const [listName, setListName] = useState(currentName);

    return (
    <Popup
        title="Rename the list"
        onClose={onClose}
        onConfirm={() => {
        if (listName.trim()) {
            onRename(listName);
        }
        }}
    >
        <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="New title"
        className="border w-full p-2 rounded"
        />
    </Popup>
    );
}
