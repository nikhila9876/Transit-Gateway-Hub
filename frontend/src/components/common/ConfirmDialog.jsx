import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-600">{message}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-sm ${
            type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
