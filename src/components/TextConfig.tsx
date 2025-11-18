'use client';
import { Button, Textarea } from '@teable/ui-lib';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';

export const TextConfig = () => {
  const { t } = useTranslation();
  const { storage, onStorageChange } = useTextContext();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storage?.content) {
      setContent(storage.content);
    } else {
      setIsEditing(true);
    }
  }, [storage]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onStorageChange({ content });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save content', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(storage?.content || '');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="px-3 py-2 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="w-full"
        >
          {t('editText')}
        </Button>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 border-b space-y-2">
      <div className="text-sm font-medium">{t('configureText')}</div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t('textPlaceholder')}
        className="min-h-[200px] font-mono text-sm"
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} className="flex-1" disabled={isSaving}>
          {isSaving ? t('saving') : t('save')}
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel} className="flex-1" disabled={isSaving}>
          {t('cancel')}
        </Button>
      </div>
    </div>
  );
};

