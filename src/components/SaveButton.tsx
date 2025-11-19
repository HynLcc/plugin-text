'use client';
import { Button } from '@teable/ui-lib';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';

/**
 * Props for SaveButton component
 */
interface SaveButtonProps {
  /** Callback function when save is completed successfully */
  onSaveComplete?: () => void;
  /** CSS class name for styling */
  className?: string;
  /** Whether to show cancel button */
  showCancel?: boolean;
  /** Callback function when cancel is clicked */
  onCancel?: () => void;
}

/**
 * Reusable save button component with loading state
 * Handles save operations and displays loading indicators
 *
 * @param props - Component props
 * @returns Save button component
 */
export const SaveButton = ({
  onSaveComplete,
  className = '',
  showCancel = false,
  onCancel,
}: SaveButtonProps) => {
  const { t } = useTranslation();
  const { handleSave, isSaving } = useTextContext();

  const handleClick = async () => {
    try {
      await handleSave();
      onSaveComplete?.();
    } catch (error) {
      // Error handling is done in handleSave
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {showCancel && onCancel && (
        <Button
          size="xs"
          variant="outline"
          onClick={onCancel}
          className="text-xs"
        >
          {t('cancel')}
        </Button>
      )}
      <Button
        size="xs"
        onClick={handleClick}
        disabled={isSaving}
        className="text-xs"
      >
        {isSaving ? t('saving') : t('save')}
      </Button>
    </div>
  );
};