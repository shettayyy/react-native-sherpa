import { StyleSheet, Text, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { colors, spacing, typography } from '@shared/styles';

interface ProductCardInfoProps {
  tourId: string;
  ratingStepName: string;
  ratingOrder: number;
  priceStepName: string;
  priceOrder: number;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  showRatingStep: boolean;
  showPriceStep: boolean;
}

/** Name, star rating, and price row for a product card. */
export function ProductCardInfo({
  tourId,
  ratingStepName,
  ratingOrder,
  priceStepName,
  priceOrder,
  name,
  rating,
  reviewCount,
  price,
  originalPrice,
  showRatingStep,
  showPriceStep,
}: Readonly<ProductCardInfoProps>) {
  const stars =
    '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

  const ratingBlock = (
    <View style={styles.ratingRow}>
      <Text style={styles.stars}>{stars}</Text>
      <Text style={styles.reviewCount}>({reviewCount})</Text>
    </View>
  );

  const priceBlock = (
    <View style={styles.priceRow}>
      <Text style={styles.price}>{price}</Text>
      {originalPrice ? (
        <Text style={styles.originalPrice}>{originalPrice}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>

      {showRatingStep ? (
        <TourStep
          tourId={tourId}
          name={ratingStepName}
          order={ratingOrder}
          tooltipPlacement="top"
          content={{
            type: 'text',
            title: 'Verified Ratings',
            body: 'All ratings come from verified purchases. No anonymous reviews.',
          }}
        >
          {ratingBlock}
        </TourStep>
      ) : (
        ratingBlock
      )}

      {showPriceStep ? (
        <TourStep
          tourId={tourId}
          name={priceStepName}
          order={priceOrder}
          tooltipPlacement="top"
          content={{
            type: 'text',
            title: 'Price Drop Highlight',
            body: 'Prices shown in red are actively discounted. The original price is shown struck through.',
          }}
        >
          {priceBlock}
        </TourStep>
      ) : (
        priceBlock
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  name: {
    fontSize: typography.size.base,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    lineHeight: typography.lineHeight.normal,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stars: {
    fontSize: typography.size.sm,
    color: '#f59e0b',
  },
  reviewCount: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  originalPrice: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
});
