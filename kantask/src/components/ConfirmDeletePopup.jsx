'use client';

import Popup from "./Popup";

export default function ConfirmDeletePopup({ onClose, onDelete }) {
    return (
    <Popup
        title="Delete the list ?"
        onClose={onClose}
        onConfirm={onDelete}
    >
        <p className="text-gray-700">This action is irreversible.</p>
    </Popup>
    );
}
