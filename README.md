# react-native-sherpa

In-app tour and onboarding library for React Native. Works with Expo, bare React Native, and React Native Web.

## What it does

- Multi-step tours with a spotlight overlay and tooltip
- Animated SVG mask with spring transitions between steps
- Beacon pulse on each step target
- Tooltip auto-placement (top, bottom, left, right) with per-step override
- Custom overlay and tooltip support
- Reanimated 3 animations with `useReducedMotion()` support
- Type-safe tour and step names via module augmentation
- Multiple independent tours with a queue
- 100% TypeScript strict mode

## Installation

```sh
npm install react-native-sherpa
# or
yarn add react-native-sherpa
```

### Peer dependencies

```sh
npm install react-native-reanimated react-native-svg react-native-worklets
```

Setup guides:

- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [react-native-worklets](https://github.com/margelo/react-native-worklets)

---

## Setup

### 1. Wrap your app with `TourProvider`

Put `TourProvider` near the root of your tree. Any screen inside it can register steps and start tours.

```tsx
import { TourProvider } from 'react-native-sherpa';

export default function RootLayout() {
  return (
    <TourProvider>
      <Stack />
    </TourProvider>
  );
}
```

### 2. Register your tours (optional but recommended)

Module augmentation lets TypeScript catch typos in tour IDs and step names. Add a `sherpa-registry.d.ts` anywhere in your project:

```ts
import 'react-native-sherpa';

declare module 'react-native-sherpa' {
  interface SherpaRegistry {
    'profile-tour': {
      steps: 'avatar' | 'follow-button' | 'bio' | 'stats';
    };
  }
}
```

With this in place, `start('typo-tour')` is a TypeScript error. Without it, `tourId` and `name` accept any string.

### 3. Mark elements as tour steps

Wrap any element with `<TourStep>`. Measurements are handled automatically -- no refs needed.

```tsx
import { TourStep } from 'react-native-sherpa';

function ProfileHeader() {
  return (
    <TourStep
      tourId="profile-tour"
      name="avatar"
      order={1}
      content={{
        type: 'text',
        title: 'Your Avatar',
        body: 'Tap to update your profile picture.',
      }}
    >
      <Avatar />
    </TourStep>
  );
}
```

Steps can be in any component in the tree. They register themselves with `TourProvider` on mount.

### 4. Start a tour

Call `start` from `useTourActions()` anywhere inside `TourProvider`:

```tsx
import { useTourActions } from 'react-native-sherpa';

function StartButton() {
  const { start } = useTourActions();
  return <Button onPress={() => start('profile-tour')} label="Take a tour" />;
}
```

---

## API reference

### `TourProvider` props

| Prop             | Type                                 | Description                              |
| ---------------- | ------------------------------------ | ---------------------------------------- |
| `theme`          | `Partial<SherpaTheme>`               | Override default light theme tokens      |
| `overlay`        | `OverlayComponent`                   | Replace the default SVG overlay          |
| `tooltip`        | `TooltipComponent`                   | Replace the default tooltip              |
| `onTourStart`    | `(event: TourStartEvent) => void`    | Called when a tour starts                |
| `onTourComplete` | `(event: TourCompleteEvent) => void` | Called when a tour reaches the last step |
| `onTourSkip`     | `(event: TourSkipEvent) => void`     | Called when a tour is skipped            |
| `onTourDismiss`  | `(event: TourDismissEvent) => void`  | Called when a tour is dismissed early    |
| `onStepEnter`    | `(event: StepEnterEvent) => void`    | Called when a step becomes active        |
| `onStepExit`     | `(event: StepExitEvent) => void`     | Called when leaving a step               |
| `onStepSkip`     | `(event: StepSkipEvent) => void`     | Called when a step is skipped            |
| `onStepAction`   | `(event: StepActionEvent) => void`   | Called on step-level actions             |

### `TourStep` props

| Prop | Type | Description |
| --- | --- | --- |
| `tourId` | `RegisteredTourId` | Which tour this step belongs to |
| `name` | `RegisteredStepName` | Unique name within the tour |
| `order` | `number` | Position in the sequence (ascending) |
| `content` | `StepContent` | Text, component, or image content for the default tooltip |
| `tooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right'` | Override auto-placement |
| `interactionMode` | `InteractionMode` | Whether touches pass through the overlay (`'none'` or `'touch-through'`) |
| `maskShape` | `'rounded-rect' \| 'circle' \| 'custom'` | Shape of the spotlight hole |
| `maskPadding` | `number` | Extra space around the element (default `8`) |
| `maskBorderRadius` | `number` | Corner radius of the rounded-rect spotlight (default `4`) |
| `customMaskPath` | `MaskPathFn` | Custom SVG path function when `maskShape="custom"` |
| `metadata` | `Record<string, unknown>` | Arbitrary data passed to tooltip and event callbacks |

### `useTourActions()`

```ts
const {
  start,   // (tourId) => void
  next,    // () => void
  prev,    // () => void
  goTo,    // (indexOrName) => void
  pause,   // () => void
  resume,  // () => void
  dismiss, // () => void
  reset,   // (tourId?) => void
  enqueue, // (tourId) => void
} = useTourActions();
```

### `useTourState()`

```ts
const {
  status,           // TourStatus: 'idle' | 'running' | 'paused' | 'completed' | 'dismissed'
  activeTourId,     // string | null
  currentStepIndex, // number
  totalSteps,       // number
  queue,            // string[]
} = useTourState();
```

### `SherpaTheme`

Pass a partial theme to `TourProvider` to override tokens. Anything not specified falls back to the defaults.

```ts
type SherpaTheme = {
  overlay: {
    color: string;   // default '#000000'
    opacity: number; // default 0.6
  };
  tooltip: {
    backgroundColor: string; // default '#FFFFFF'
    textColor: string;        // default '#000000'
    borderRadius: number;     // default 8
    padding: number;          // default 16
    titleFontSize: number;    // default 16
    bodyFontSize: number;     // default 14
  };
  beacon: {
    color: string;   // default '#FFFFFF'
    opacity: number; // default 0.7
  };
};
```

Example with a dark overlay and custom tooltip background:

```tsx
<TourProvider
  theme={{
    overlay: { opacity: 0.75 },
    tooltip: { backgroundColor: '#1a1a2e', textColor: '#ffffff' },
  }}
>
```

---

## Custom tooltip

Pass a `tooltip` prop to `TourProvider` to replace the default tooltip:

```tsx
import type { TooltipProps } from 'react-native-sherpa';

function MyTooltip({
  currentStep,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
  onDismiss,
}: TooltipProps) {
  return (
    <View style={styles.tooltip}>
      <Text>{currentStep.content?.title}</Text>
      <Text>
        {stepIndex + 1} / {totalSteps}
      </Text>
      <Button onPress={onNext} label="Next" />
      <Button onPress={onDismiss} label="Skip" />
    </View>
  );
}

<TourProvider tooltip={MyTooltip}>{/* ... */}</TourProvider>;
```

---

## Triggering tours from outside React

`useTourActions()` works inside any component that's a descendant of `TourProvider`. If you need to trigger a tour from outside React (a push notification handler, a native module callback, etc.), pass a `ref` to `TourProvider`:

```tsx
import { useRef } from 'react';
import { TourProvider, type TourProviderHandle } from 'react-native-sherpa';

export default function App() {
  const tourRef = useRef<TourProviderHandle>(null);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(() => {
      tourRef.current?.start('onboarding-tour');
    });
    return () => sub.remove();
  }, []);

  return (
    <TourProvider ref={tourRef}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </TourProvider>
  );
}
```

The ref exposes the same methods as `useTourActions()`: `start`, `next`, `prev`, `goTo`, `pause`, `resume`, `dismiss`, `reset`, `enqueue`.

---

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
