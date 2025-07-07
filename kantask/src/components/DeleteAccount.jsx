"use client";

export default function DeleteAccountPopup({ onClose, onConfirm, email }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                <h2 className="text-lg font-bold mb-4 text-center">
                    DELETE ACCOUNT ?
                </h2>
                <p className="text-center mb-6">Your account "{email}" will be permanently deleted.</p>
                <div className="flex justify-center items-center gap-2">
                    <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded hover:shadow-xl">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="bg-error text-white px-4 py-2 rounded hover:shadow-xl">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}