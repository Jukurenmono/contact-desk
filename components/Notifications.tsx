import React, { useEffect } from 'react';

interface ModalProps {
  type: 'success' | 'error' | 'confirmation';
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  duration?: number; // Duration in milliseconds to automatically close the modal
}

const NotificationModal: React.FC<ModalProps> = ({
  type,
  message,
  onClose,
  onConfirm,
  duration = 3000, // Default duration is 3 seconds
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the modal after the specified duration
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md max-w-sm w-full">
        <h3 className="text-lg font-bold text-center">
          {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Confirm'}
        </h3>
        <p className="my-4">{message}</p>

        <div className="flex justify-end space-x-4">
          {/* You can still close the modal manually */}
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>

          {/* Show confirm button only for confirmation type */}
          {type === 'confirmation' && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
