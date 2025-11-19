'use client';
import { useState, useCallback } from 'react';
import { Textarea } from '@teable/ui-lib';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';
import { MAX_CONTENT_LENGTH } from '@/utils/alignment';

/**
 * TextConfig component with content length validation
 * Provides a textarea for editing markdown content with length restrictions
 *
 * @returns TextConfig component
 */
export const TextConfig = () => {
  const { t } = useTranslation();
  const { content, setContent } = useTextContext();
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Handle content change with validation
   * Validates content length and updates error message accordingly
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Check content length limit
    if (newValue.length > MAX_CONTENT_LENGTH) {
      setErrorMessage(t('contentTooLong', { maxLength: MAX_CONTENT_LENGTH }));
      // Don't update content if it exceeds limit
      return;
    } else {
      setErrorMessage('');
      setContent(newValue);
    }
  }, [setContent, t]);

  return (
    <div className="h-full flex flex-col">
      {/* Error message display */}
      {errorMessage && (
        <div className="px-3 py-1 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border-b border-red-200">
          {errorMessage}
        </div>
      )}

      <div className="flex-1 overflow-auto px-3 py-4">
        <Textarea
          value={content}
          onChange={handleChange}
          placeholder={t('textPlaceholder')}
          className={`h-full w-full font-mono text-xs resize-none text-foreground placeholder:text-muted-foreground ${
            errorMessage ? 'border-red-300 focus:border-red-500' : ''
          }`}
        />

        {/* Content length indicator */}
        <div className="mt-2 text-xs text-muted-foreground text-right">
          {content.length.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

