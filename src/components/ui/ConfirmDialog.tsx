import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'primary'
}) => {
  const iconConfig = {
    primary: { bg: 'bg-indigo-100', text: 'text-indigo-600', Icon: Info },
    danger: { bg: 'bg-red-100', text: 'text-red-600', Icon: AlertTriangle },
    success: { bg: 'bg-emerald-100', text: 'text-emerald-600', Icon: CheckCircle }
  };
  
  const { bg, text, Icon } = iconConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>{cancelText}</Button>
          <Button variant={variant} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center pt-4">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${bg} ${text}`}>
          <Icon size={24} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{message}</p>
      </div>
    </Modal>
  );
};
