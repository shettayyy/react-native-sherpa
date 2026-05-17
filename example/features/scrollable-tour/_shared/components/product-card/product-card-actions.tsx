import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TourStep } from 'react-native-sherpa';

import { Button } from '@shared/components/button';
import { colors, spacing, typography } from '@shared/styles';

interface ProductCardActionsProps {
  tourId: string;
  cartStepName: string;
  cartOrder: number;
  wishlistStepName: string;
  wishlistOrder: number;
  showCartStep: boolean;
  showWishlistStep: boolean;
}

/** Add to Cart button and wishlist icon for a product card. */
export function ProductCardActions({
  tourId,
  cartStepName,
  cartOrder,
  wishlistStepName,
  wishlistOrder,
  showCartStep,
  showWishlistStep,
}: Readonly<ProductCardActionsProps>) {
  const cartButton = <Button label="Add to Cart" />;

  const wishlistButton = (
    <TouchableOpacity
      style={styles.wishlist}
      accessibilityRole="button"
      accessibilityLabel="Save to wishlist"
    >
      <Text style={styles.heart}>♡</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.row}>
      <View style={styles.cartWrapper}>
        {showCartStep ? (
          <TourStep
            tourId={tourId}
            name={cartStepName}
            order={cartOrder}
            tooltipPlacement="top"
            content={{
              type: 'text',
              title: 'Add to Cart',
              body: 'Adding to cart locks in the current price, even if it goes up before checkout.',
            }}
          >
            {cartButton}
          </TourStep>
        ) : (
          cartButton
        )}
      </View>

      {showWishlistStep ? (
        <TourStep
          tourId={tourId}
          name={wishlistStepName}
          order={wishlistOrder}
          tooltipPlacement="top"
          content={{
            type: 'text',
            title: 'Save for Later',
            body: 'Wishlist items sync across all your devices. Come back any time.',
          }}
        >
          {wishlistButton}
        </TourStep>
      ) : (
        wishlistButton
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cartWrapper: {
    flex: 1,
  },
  wishlist: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    fontSize: typography.size.xl,
    color: colors.text.muted,
  },
});
