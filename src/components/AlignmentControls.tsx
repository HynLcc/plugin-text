'use client';
import { Button } from '@teable/ui-lib';
import { useTranslation } from 'react-i18next';
import { HorizontalAlign, ALIGNMENT_OPTIONS } from '@/utils/alignment';

/**
 * Props for AlignmentControls component
 */
interface AlignmentControlsProps {
  /** Current horizontal alignment value */
  horizontalAlign: HorizontalAlign;
  /** Callback function when alignment changes */
  onAlignChange: (align: HorizontalAlign) => void;
  /** CSS class name for styling */
  className?: string;
}

/**
 * Reusable component for horizontal alignment controls
 * Provides buttons for left, center, and right text alignment
 *
 * @param props - Component props
 * @returns Alignment control buttons component
 */
export const AlignmentControls = ({
  horizontalAlign,
  onAlignChange,
  className = '',
}: AlignmentControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">
        {t('align.horizontal')}
      </span>
      <div className="flex gap-1">
        {ALIGNMENT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="xs"
            variant={horizontalAlign === option.value ? "default" : "outline"}
            onClick={() => onAlignChange(option.value)}
            className="text-xs"
          >
            {t(option.label)}
          </Button>
        ))}
      </div>
    </div>
  );
};