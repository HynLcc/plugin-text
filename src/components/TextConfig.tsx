'use client';
import { Textarea } from '@teable/ui-lib';
import { useTranslation } from 'react-i18next';
import { useTextContext } from './context/TextProvider';

export const TextConfig = () => {
  const { t } = useTranslation();
  const { content, setContent } = useTextContext();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto px-3 py-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('textPlaceholder')}
          className="h-full w-full font-mono text-xs resize-none text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
};

