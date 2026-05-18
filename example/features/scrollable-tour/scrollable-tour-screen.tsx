import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TourStep,
  useTourActions,
  useTourScrollAdapter,
  measureLayout,
  delay,
} from 'react-native-sherpa';

import { Button } from '@shared/components/button';
import { colors, spacing, typography } from '@shared/styles';
import { FilterBar } from './_shared/components/filter-bar';
import { PromoBanner } from './_shared/components/promo-banner';
import { ProductCard } from './_shared/components/product-card/product-card';

const TOUR_ID = 'scrollable-tour';

const PRODUCTS = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    rating: 4,
    reviewCount: 2341,
    price: '$79.99',
    originalPrice: '$129.99',
    imageColor: '#6366f1',
    imageLabel: 'Headphones',
  },
  {
    name: 'Minimalist Leather Watch',
    rating: 5,
    reviewCount: 876,
    price: '$149.00',
    imageColor: '#0ea5e9',
    imageLabel: 'Watch',
  },
  {
    name: 'Portable Bluetooth Speaker',
    rating: 4,
    reviewCount: 1204,
    price: '$49.99',
    originalPrice: '$69.99',
    imageColor: '#10b981',
    imageLabel: 'Speaker',
  },
] as const;

/** Demo screen for testing scroll-to-step behaviour. Each tour step targets an element at a different scroll depth. */
export function ScrollableTourScreen() {
  const insets = useSafeAreaInsets();
  const { start } = useTourActions();
  const [activeFilter, setActiveFilter] = useState('All');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollHeightRef = useRef(0);

  useTourScrollAdapter(TOUR_ID, async (_, viewRef) => {
    const { y, height } = await measureLayout(
      viewRef.current,
      scrollRef.current
    );
    const centeredY = y - scrollHeightRef.current / 2 + height / 2;
    scrollRef.current?.scrollTo({ y: Math.max(0, centeredY), animated: true });
    // Wait for the animated scroll to settle before the tour measures the target's final position.
    await delay(350);
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        onLayout={(e) => {
          scrollHeightRef.current = e.nativeEvent.layout.height;
        }}
      >
        <PromoBanner tourId={TOUR_ID} />

        <View style={styles.section}>
          <FilterBar
            tourId={TOUR_ID}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </View>

        <Text style={styles.sectionHeading}>Today's Picks</Text>

        <View style={styles.cardList}>
          {/* Card 1 — steps 3 (image) + 4 (rating) + 5 (cart) */}
          <ProductCard
            tourId={TOUR_ID}
            {...PRODUCTS[0]}
            imageStepName="card1-image"
            imageOrder={3}
            ratingStepName="card1-rating"
            ratingOrder={4}
            priceStepName="card1-price"
            priceOrder={-1}
            cartStepName="card1-cart"
            cartOrder={5}
            wishlistStepName="card1-wishlist"
            wishlistOrder={-1}
            showImageStep
            showRatingStep
            showCartStep
          />

          {/* Card 2 — step 6 (wishlist) */}
          <ProductCard
            tourId={TOUR_ID}
            {...PRODUCTS[1]}
            imageStepName="card2-image"
            imageOrder={-1}
            ratingStepName="card2-rating"
            ratingOrder={-1}
            priceStepName="card2-price"
            priceOrder={-1}
            cartStepName="card2-cart"
            cartOrder={-1}
            wishlistStepName="card2-wishlist"
            wishlistOrder={6}
            showWishlistStep
          />

          {/* Card 3 — step 7 (price drop) */}
          <ProductCard
            tourId={TOUR_ID}
            {...PRODUCTS[2]}
            imageStepName="card3-image"
            imageOrder={-1}
            ratingStepName="card3-rating"
            ratingOrder={-1}
            priceStepName="card3-price"
            priceOrder={7}
            cartStepName="card3-cart"
            cartOrder={-1}
            wishlistStepName="card3-wishlist"
            wishlistOrder={-1}
            showPriceStep
          />
        </View>

        {/* Step 8 — load-more CTA at the bottom */}
        <TourStep
          tourId={TOUR_ID}
          name="load-more"
          order={8}
          tooltipPlacement="top"
          content={{
            type: 'text',
            title: 'Load More',
            body: 'Pull down to refresh, or tap here to load the next page of results.',
          }}
        >
          <View style={styles.loadMore}>
            <Text style={styles.loadMoreLabel}>Load more results</Text>
          </View>
        </TourStep>
      </ScrollView>

      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <Button label="Start Tour" onPress={() => start(TOUR_ID)} />
        <Text style={styles.hint}>
          This tour tests scroll-to-step. Steps are spread across the full page
          length.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.screen,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
    backgroundColor: colors.background.screen,
    gap: spacing.lg,
  },
  section: {
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  sectionHeading: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
  },
  cardList: {
    gap: spacing.lg,
  },
  loadMore: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border.subtle,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background.card,
  },
  loadMoreLabel: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    color: colors.text.muted,
  },
  stickyFooter: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    backgroundColor: colors.background.screen,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  hint: {
    fontSize: typography.size.sm,
    color: colors.text.hint,
    textAlign: 'center',
    lineHeight: typography.lineHeight.normal,
  },
});
