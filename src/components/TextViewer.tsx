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
  const horizontalAlign = storage?.horizontalAlign || 'left';

  
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
      <div className="flex-1 overflow-auto px-3 py-4 w-full">
        <div className={`w-full ${
          horizontalAlign === 'center' ? 'text-center' :
          horizontalAlign === 'right' ? 'text-right' :
          'text-left'
        } prose prose-sm dark:prose-invert max-w-full text-sm text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:bg-gray-100 prose-code:font-mono prose-code:text-gray-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:text-gray-900 prose-pre:font-mono prose-pre:px-4 prose-pre:py-3 prose-pre:rounded prose-pre:border prose-pre:border-gray-200 prose-pre:overflow-x-auto prose-li:text-foreground prose-a:text-primary prose-img:max-w-full`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => {
                if (horizontalAlign === 'center') {
                  return <img {...props} className="mx-auto block max-w-full" alt={props.alt} />;
                } else if (horizontalAlign === 'right') {
                  return <img {...props} className="ml-auto block max-w-full" alt={props.alt} />;
                }
                return <img {...props} className="max-w-full" alt={props.alt} />;
              },
              ul: ({ node, ...props }) => {
                const alignClass = horizontalAlign === 'center' ? 'text-center' :
                                  horizontalAlign === 'right' ? 'text-right' : 'text-left';
                return <ul {...props} className={`${alignClass} list-inside`} />;
              },
              ol: ({ node, ...props }) => {
                const alignClass = horizontalAlign === 'center' ? 'text-center' :
                                  horizontalAlign === 'right' ? 'text-right' : 'text-left';
                return <ol {...props} className={`${alignClass} list-inside`} />;
              },
              li: ({ node, ...props }) => {
                const alignClass = horizontalAlign === 'center' ? 'text-center' :
                                  horizontalAlign === 'right' ? 'text-right' : 'text-left';
                return <li {...props} className={alignClass} />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};