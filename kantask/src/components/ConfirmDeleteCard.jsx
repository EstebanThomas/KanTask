'use client';

import Popup from "./Popup";

export default function ConfirmDeleteCard({ onClose, onDelete }) {
    return (
    <Popup
        title="Delete the card ?"
        onClose={onClose}
        onConfirm={onDelete}
    >
        <p className="text-black">This action is irreversible.</p>
    </Popup>
    );
}
