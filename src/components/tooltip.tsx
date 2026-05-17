import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Animated from 'react-native-reanimated';

import type {
  TooltipProps,
  SherpaTheme,
  TooltipPlacement,
} from '@sherpa/types';
import { resolveTooltipPlacement } from '@sherpa/utilities';
import { useTooltipAnimation } from '@sherpa/hooks';

const TOOLTIP_GAP = 12;
const TOOLTIP_MAX_WIDTH = 280;

type DefaultTooltipProps = TooltipProps & {
  theme: SherpaTheme;
};

function resolvePosition(
  placement: TooltipPlacement,
  measurement: TooltipProps['measurement'],
  canvas: { width: number; height: number }
): { top?: number; bottom?: number; left?: number; right?: number } {
  const { pageX, pageY, width, height } = measurement;
  const centerX = pageX + width / 2;

  const clampedLeft = Math.max(
    8,
    Math.min(
      centerX - TOOLTIP_MAX_WIDTH / 2,
      canvas.width - TOOLTIP_MAX_WIDTH - 8
    )
  );

  if (placement === 'top') {
    // Cap bottom so the tooltip never overflows above the screen top (8px margin).
    const bottom = Math.min(
      canvas.height - pageY + TOOLTIP_GAP,
      canvas.height - 8
    );
    return { bottom, left: clampedLeft };
  }

  if (placement === 'bottom') {
    // Cap top so the tooltip never overflows below the screen bottom (8px margin).
    const top = Math.min(pageY + height + TOOLTIP_GAP, canvas.height - 8);
    return { top, left: clampedLeft };
  }

  if (placement === 'left') {
    // Clamp vertical so tooltip never overflows screen bottom.
    const top = Math.min(pageY, canvas.height - 8);
    // Clamp right so tooltip never overflows off the left edge.
    const right = Math.min(
      canvas.width - pageX + TOOLTIP_GAP,
      canvas.width - TOOLTIP_MAX_WIDTH - 8
    );
    return { top, right };
  }

  // right placement
  // Clamp vertical so tooltip never overflows screen bottom.
  const top = Math.min(pageY, canvas.height - 8);
  // Clamp left so tooltip never overflows off the right edge.
  const left = Math.min(
    pageX + width + TOOLTIP_GAP,
    canvas.width - TOOLTIP_MAX_WIDTH - 8
  );
  return { top, left };
}

function TooltipContent({
  currentStep,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onDismiss,
  theme,
}: Readonly<DefaultTooltipProps>) {
  const {
    backgroundColor,
    textColor,
    borderRadius,
    padding,
    titleFontSize,
    bodyFontSize,
  } = theme.tooltip;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const content = currentStep.content;

  return (
    <View
      style={[styles.container, { backgroundColor, borderRadius, padding }]}
    >
      {content?.type === 'text' && (
        <>
          {typeof content.title === 'string' ? (
            <Text
              style={[
                styles.title,
                { color: textColor, fontSize: titleFontSize },
                'titleStyle' in content ? content.titleStyle : undefined,
              ]}
            >
              {content.title}
            </Text>
          ) : (
            content.title
          )}
          {typeof content.body === 'string' ? (
            <Text
              style={[
                styles.body,
                { color: textColor, fontSize: bodyFontSize },
                'bodyStyle' in content ? content.bodyStyle : undefined,
              ]}
            >
              {content.body}
            </Text>
          ) : (
            content.body
          )}
        </>
      )}

      {content?.type === 'component' && content.render()}

      {content?.type === 'image' && content.title !== undefined && (
        <Text
          style={[styles.title, { color: textColor, fontSize: titleFontSize }]}
        >
          {content.title}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={[styles.stepCount, { color: textColor }]}>
          {stepIndex + 1} / {totalSteps}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onDismiss}
            hitSlop={8}
            accessibilityLabel="Dismiss tour"
          >
            <Text style={[styles.actionText, { color: textColor }]}>Skip</Text>
          </TouchableOpacity>
          {!isFirst && (
            <TouchableOpacity
              onPress={onPrev}
              hitSlop={8}
              accessibilityLabel="Previous step"
            >
              <Text style={[styles.actionText, { color: textColor }]}>
                Back
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={onNext}
            hitSlop={8}
            accessibilityLabel={isLast ? 'Finish tour' : 'Next step'}
          >
            <Text
              style={[
                styles.actionText,
                styles.actionPrimary,
                { color: textColor },
              ]}
            >
              {isLast ? 'Done' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function Tooltip(props: Readonly<DefaultTooltipProps>) {
  const { width: canvasWidth, height: canvasHeight } = useWindowDimensions();
  const { measurement, currentStep, stepIndex } = props;

  const placement = resolveTooltipPlacement(
    measurement,
    { width: canvasWidth, height: canvasHeight },
    currentStep.tooltipPlacement
  );

  const position = resolvePosition(placement, measurement, {
    width: canvasWidth,
    height: canvasHeight,
  });

  const { animatedStyle } = useTooltipAnimation(stepIndex);

  return (
    <Animated.View
      style={[
        styles.absoluteContainer,
        position,
        { maxWidth: TOOLTIP_MAX_WIDTH },
        animatedStyle,
      ]}
      pointerEvents="box-none"
    >
      <TooltipContent {...props} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
  },
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  body: {
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stepCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionText: {
    fontSize: 14,
  },
  actionPrimary: {
    fontWeight: '600',
  },
});
