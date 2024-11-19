// ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ isOpen, onCancel, onConfirm, message, confirmText, cancelText }) => {
    if (!isOpen) return null; // Return null if the modal is not open

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm rounded-xl overflow-hidden w-full max-w-sm p-5 m-4">
                <h3 className="font-bold text-gray-800 dark:text-white">Confirm Action</h3>
                <p className="text-gray-600 dark:text-neutral-400">{message}</p>
                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={onCancel}
                    >
                        {cancelText || 'Cancel'}
                    </button>
                    <button
                        type="button"
                        className="py-2 px-4 mx-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                        onClick={onConfirm}
                    >
                        {confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
