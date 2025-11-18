'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';

export const TextViewer = () => {
  const { t } = useTranslation();
  const { storage } = useTextContext();
  const content = storage?.content || '';

  if (!content) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {t('noContent')}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto px-3 py-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

