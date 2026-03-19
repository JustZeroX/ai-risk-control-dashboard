import React, { useEffect, useState } from 'react';
import { Modal } from './ui/Modal';
import Markdown from 'react-markdown';
import { Button } from './ui/Button';

interface PRDModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PRDModal: React.FC<PRDModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch the markdown file content
      fetch('/需求.md')
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(err => console.error('Failed to load PRD:', err));
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="需求文档"
      maxWidth="max-w-4xl"
    >
      <div className="prose prose-slate max-w-none max-h-[70vh] overflow-y-auto pr-2">
        <Markdown>{content}</Markdown>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
};
