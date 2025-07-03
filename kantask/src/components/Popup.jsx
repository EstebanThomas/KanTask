'use client';

export default function Popup({ title, children, onClose, onConfirm }) {
    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div>{children}</div>
        <div className="flex justify-end gap-3 mt-4">
            <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
            Cancel
            </button>
            <button
            onClick={onConfirm}
            className="px-4 py-2 bg-success text-white rounded hover:bg-green-600"
            >
            Confirm
            </button>
        </div>
        </div>
    </div>
    );
}
