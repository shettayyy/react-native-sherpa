export const typography = {
  size: {
    'xs': 12,
    'sm': 13,
    'md': 14,
    'base': 15,
    'lg': 16,
    'xl': 17,
    '2xl': 20,
  },
  weight: {
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 18,
    normal: 19,
    relaxed: 21,
  },
} as const;
