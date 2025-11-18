'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';
import { Button } from '@teable/ui-lib';

interface TextViewerProps {
  onEdit?: () => void;
  showEditButton?: boolean;
}

export const TextViewer = ({ onEdit, showEditButton = false }: TextViewerProps) => {
  const { t } = useTranslation();
  const { storage } = useTextContext();
  const content = storage?.content || '';

  return (
    <div className="h-full flex flex-col">
      {showEditButton && onEdit && (
        <div className="flex items-center justify-end px-1 py-1 pr-4 flex-shrink-0 gap-2">
          <div className="flex-1 border-t border-border"></div>
          <Button
            size="xs"
            onClick={onEdit}
            className="text-xs"
          >
            {t('viewEditText')}
          </Button>
        </div>
      )}
      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:text-foreground prose-li:text-foreground prose-a:text-primary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

