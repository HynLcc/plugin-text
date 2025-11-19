'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';
import { Button } from '@teable/ui-lib';
import { getAlignmentClass, getImageAlignmentClass } from '@/utils/alignment';

/**
 * Props for TextViewer component
 */
interface TextViewerProps {
  /** Callback function when edit button is clicked */
  onEdit?: () => void;
  /** Whether to show the edit button in the header */
  showEditButton?: boolean;
}

/**
 * TextViewer component for displaying markdown content with horizontal alignment support
 * Renders markdown text with proper styling and alignment for text, images, and lists
 *
 * @param props - Component props
 * @returns TextViewer component
 */
export const TextViewer = ({ onEdit, showEditButton = false }: TextViewerProps) => {
  const { t } = useTranslation();
  const { storage } = useTextContext();
  const content = storage?.content || '';
  const horizontalAlign = storage?.horizontalAlign || 'left';

  return (
    <div className="h-full flex flex-col">
      {/* Edit button header - only shown when edit mode is available */}
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

      {/* Main content area with markdown rendering */}
      <div className="flex-1 overflow-auto px-3 py-4 w-full">
        <div className={`
          w-full ${getAlignmentClass(horizontalAlign)}
          prose prose-sm dark:prose-invert max-w-full text-sm text-foreground
          prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground
          prose-code:bg-gray-100 prose-code:font-mono prose-code:text-gray-900 prose-code:px-1
          prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:text-gray-900
          prose-pre:font-mono prose-pre:px-4 prose-pre:py-3 prose-pre:rounded
          prose-pre:border prose-pre:border-gray-200 prose-pre:overflow-x-auto
          prose-li:text-foreground prose-a:text-primary prose-img:max-w-full
        `}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              /**
               * Custom image component with alignment support
               * Handles horizontal alignment for images in markdown content
               */
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  className={`${getImageAlignmentClass(horizontalAlign)} max-w-full`}
                  alt={props.alt}
                />
              ),

              /**
               * Custom unordered list component with alignment support
               * Applies text alignment to list content
               */
              ul: ({ node, ...props }) => (
                <ul
                  {...props}
                  className={`${getAlignmentClass(horizontalAlign)} list-inside`}
                />
              ),

              /**
               * Custom ordered list component with alignment support
               * Applies text alignment to list content
               */
              ol: ({ node, ...props }) => (
                <ol
                  {...props}
                  className={`${getAlignmentClass(horizontalAlign)} list-inside`}
                />
              ),

              /**
               * Custom list item component with alignment support
               * Ensures individual list items follow the alignment setting
               */
              li: ({ node, ...props }) => (
                <li
                  {...props}
                  className={getAlignmentClass(horizontalAlign)}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};