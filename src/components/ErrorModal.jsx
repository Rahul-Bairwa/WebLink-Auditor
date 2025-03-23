import { useEffect, useState } from "react";
import { MdError } from "react-icons/md";

const ErrorModal = ({ show, message, onClose, duration = 10000 }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (show) {
            let interval;
            setProgress(100);
            interval = setInterval(() => {
                setProgress((prev) => {
                    const nextValue = prev - 100 / (duration / 100);
                    return nextValue > 0 ? nextValue : 0;
                });
            }, 100);

            // Auto-close after duration
            const timeout = setTimeout(() => {
                onClose();
                clearInterval(interval);
            }, duration);

            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [show, duration, onClose]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-start justify-end mt-6 mr-5">
            <div className="flex items-center bg-white border border-gray-300 shadow-md rounded-lg relative h-16 px-3 overflow-x-hidden">
                {/* Red Icon */}
                <div className="text-red-500 text-xl">
                    <MdError />
                </div>

                {/* Error Message */}
                <div className="px-3 text-gray-800 text-sm font-semibold">
                    {message}
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 px-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-red-00">
                    <div
                        style={{ width: `${progress}%` }}
                        className="h-full bg-red-600 transition-all"
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
