import { StyleSheet, Text, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

interface ProductCardImageProps {
  tourId: string;
  stepName: string;
  order: number;
  color: string;
  label: string;
  showTourStep: boolean;
}

/** Placeholder image block for a product card. Uses a coloured rectangle in place of a real image. */
export function ProductCardImage({
  tourId,
  stepName,
  order,
  color,
  label,
  showTourStep,
}: Readonly<ProductCardImageProps>) {
  const imageBlock = (
    <View style={[styles.image, { backgroundColor: color }]}>
      <Text style={styles.imageLabel}>{label}</Text>
    </View>
  );

  if (!showTourStep) {
    return imageBlock;
  }

  return (
    <TourStep
      tourId={tourId}
      name={stepName}
      order={order}
      tooltipPlacement="bottom"
      content={{
        type: 'text',
        title: 'Product Photos',
        body: 'Tap the image to browse all product photos and zoom in for details.',
      }}
    >
      {imageBlock}
    </TourStep>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 160,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLabel: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.inverse,
    opacity: 0.7,
  },
});
