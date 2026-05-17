import { StyleSheet, View } from 'react-native';

import { colors, shadows, spacing } from '@shared/styles';
import { ProductCardActions } from './product-card-actions';
import { ProductCardImage } from './product-card-image';
import { ProductCardInfo } from './product-card-info';

interface ProductCardProps {
  tourId: string;
  name: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  imageColor: string;
  imageLabel: string;
  imageStepName: string;
  imageOrder: number;
  ratingStepName: string;
  ratingOrder: number;
  priceStepName: string;
  priceOrder: number;
  cartStepName: string;
  cartOrder: number;
  wishlistStepName: string;
  wishlistOrder: number;
  showImageStep?: boolean;
  showRatingStep?: boolean;
  showPriceStep?: boolean;
  showCartStep?: boolean;
  showWishlistStep?: boolean;
}

/** Full product card composed of image, info, and action sub-components. */
export function ProductCard({
  tourId,
  name,
  rating,
  reviewCount,
  price,
  originalPrice,
  imageColor,
  imageLabel,
  imageStepName,
  imageOrder,
  ratingStepName,
  ratingOrder,
  priceStepName,
  priceOrder,
  cartStepName,
  cartOrder,
  wishlistStepName,
  wishlistOrder,
  showImageStep = false,
  showRatingStep = false,
  showPriceStep = false,
  showCartStep = false,
  showWishlistStep = false,
}: Readonly<ProductCardProps>) {
  return (
    <View style={styles.card}>
      <ProductCardImage
        tourId={tourId}
        stepName={imageStepName}
        order={imageOrder}
        color={imageColor}
        label={imageLabel}
        showTourStep={showImageStep}
      />
      <ProductCardInfo
        tourId={tourId}
        ratingStepName={ratingStepName}
        ratingOrder={ratingOrder}
        priceStepName={priceStepName}
        priceOrder={priceOrder}
        name={name}
        rating={rating}
        reviewCount={reviewCount}
        price={price}
        originalPrice={originalPrice}
        showRatingStep={showRatingStep}
        showPriceStep={showPriceStep}
      />
      <ProductCardActions
        tourId={tourId}
        cartStepName={cartStepName}
        cartOrder={cartOrder}
        wishlistStepName={wishlistStepName}
        wishlistOrder={wishlistOrder}
        showCartStep={showCartStep}
        showWishlistStep={showWishlistStep}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: spacing.lg,
    ...shadows.sm,
  },
});
