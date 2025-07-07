"use client";

export default function SuccessEditAccount({ onClose}) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-80">
                <h2 className="text-lg font-bold mb-4 text-center">
                    ACCOUNT UPDATED !
                </h2>
                <div className="flex justify-center items-center gap-2">
                    <button onClick={onClose} className="bg-success text-white px-4 py-2 rounded hover:shadow-xl">
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}