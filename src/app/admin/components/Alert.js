import React from 'react';

const Alert = ({ alerts, removeAlert }) => {
    const getAlertStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-500/10 dark:text-green-400';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-500/10 dark:text-yellow-400';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/10 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    return (
        <div className="fixed top-0 right-0 z-50 space-y-3 m-5">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={`max-w-sm px-4 py-3 rounded-lg shadow-lg border ${getAlertStyles(alert.type)} alert-animation`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm">{alert.message}</span>
                        <button
                            type="button"
                            className="ml-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            onClick={() => removeAlert(alert.id)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Alert;
