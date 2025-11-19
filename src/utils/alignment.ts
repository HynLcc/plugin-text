/**
 * Alignment utility functions for text plugin
 * @fileoverview Provides helper functions for text alignment operations
 */

/**
 * Horizontal alignment options
 */
export type HorizontalAlign = 'left' | 'center' | 'right';

/**
 * Get CSS class for horizontal alignment
 * @param align - The alignment option
 * @returns CSS class string for the alignment
 */
export const getAlignmentClass = (align: HorizontalAlign): string => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};

/**
 * Get image alignment classes for horizontal alignment
 * @param align - The alignment option
 * @returns CSS class string for image alignment
 */
export const getImageAlignmentClass = (align: HorizontalAlign): string => {
  switch (align) {
    case 'center':
      return 'mx-auto block';
    case 'right':
      return 'ml-auto block';
    default:
      return '';
  }
};

/**
 * Default alignment options for UI controls
 */
export const ALIGNMENT_OPTIONS: { value: HorizontalAlign; label: string }[] = [
  { value: 'left', label: 'align.left' },
  { value: 'center', label: 'align.center' },
  { value: 'right', label: 'align.right' },
];

/**
 * Maximum content length (50KB) for performance and storage considerations
 */
export const MAX_CONTENT_LENGTH = 51200;