'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export function RejectModal({ isOpen, onClose, onConfirm, contentTitle, isLoading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = useCallback(() => {
    if (!reason.trim()) {
      setError('Please provide a rejection reason.');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Reason must be at least 10 characters.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
  }, [reason, onConfirm]);

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Reject Content" size="md">
      <div className="space-y-4">
        {contentTitle && (
          <Alert variant="warning">
            You are rejecting: <strong>{contentTitle}</strong>
          </Alert>
        )}

        <Textarea
          label="Rejection Reason"
          required
          placeholder="Explain why this content is being rejected (min. 10 characters)..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
          rows={4}
        />

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isLoading}>
            Confirm Rejection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
