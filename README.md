# react-native-sherpa

The Swiss Army knife of in-app guidance for React Native. Single-package, single API -- works with Expo, bare React Native, and React Native Web.

## Features

- Linear and multi-step tours with spotlight and tooltip
- SVG mask overlay with animated hole (spring transition between steps)
- Beacon pulse animation on each step
- Auto-placement tooltip (top, bottom, left, right) with per-step override
- Swappable overlay and tooltip components
- Reanimated 3 animations with `useReducedMotion()` support
- Type-safe tour and step names via module augmentation
- Multiple independent tours with a tour queue
- 100% TypeScript strict mode

## Installation

```sh
npm install react-native-sherpa
# or
yarn add react-native-sherpa
```

### Peer dependencies

Install the required peer dependencies alongside the library:

```sh
npm install react-native-reanimated react-native-svg react-native-worklets
```

Follow the setup guides for each:

- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/) -- add the Babel plugin as the **last** entry in `babel.config.js`
- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [react-native-worklets](https://github.com/margelo/react-native-worklets)

**Important:** `react-native-worklets/plugin` must be the last plugin in your `babel.config.js`. Sherpa will log a clear error in dev mode if the plugin is missing.

```js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // ... other plugins
    'react-native-worklets/plugin',
  ],
};
```

---

## Setup

### 1. Wrap your app with `TourProvider`

Place `TourProvider` as high as possible in your tree -- typically in your root layout. Every screen inside it can register steps and start tours.

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

### 2. Declare your tours (optional but recommended)

Module augmentation gives you type-safe tour IDs and step names. Create a `sherpa-registry.d.ts` anywhere in your project:

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

With this in place, `start('typo-tour')` is a TypeScript error. The file is optional -- without it, `tourId` and `name` accept any string.

### 3. Mark elements as tour steps

Wrap any element with `<TourStep>`. The child is measured automatically -- no refs required.

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

Steps can live in any component in the tree -- they register themselves with `TourProvider` automatically.

### 4. Start a tour

Use `useTourActions()` anywhere inside `TourProvider`:

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

| Prop | Type | Description |
|---|---|---|
| `theme` | `Partial<SherpaTheme>` | Override default light theme tokens |
| `overlay` | `OverlayComponent` | Replace the default SVG overlay entirely |
| `tooltip` | `TooltipComponent` | Replace the default tooltip entirely |
| `onTourStart` | `(event: TourStartEvent) => void` | Called when a tour starts |
| `onTourComplete` | `(event: TourCompleteEvent) => void` | Called when a tour reaches the last step |
| `onTourSkip` | `(event: TourSkipEvent) => void` | Called when a tour is skipped |
| `onTourDismiss` | `(event: TourDismissEvent) => void` | Called when a tour is dismissed early |
| `onStepEnter` | `(event: StepEnterEvent) => void` | Called when a step becomes active |
| `onStepExit` | `(event: StepExitEvent) => void` | Called when leaving a step |
| `onStepSkip` | `(event: StepSkipEvent) => void` | Called when a step is skipped |
| `onStepAction` | `(event: StepActionEvent) => void` | Called on step-level actions |

### `TourStep` props

| Prop | Type | Description |
|---|---|---|
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
  start,    // (tourId) => void
  next,     // () => void
  prev,     // () => void
  goTo,     // (indexOrName) => void
  pause,    // () => void
  resume,   // () => void
  dismiss,  // () => void
  reset,    // (tourId?) => void
  enqueue,  // (tourId) => void
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

Pass a partial theme to `TourProvider` to override any tokens. Unspecified tokens fall back to defaults.

```ts
type SherpaTheme = {
  overlay: {
    color: string;   // default '#000000'
    opacity: number; // default 0.6
  };
  tooltip: {
    backgroundColor: string; // default '#FFFFFF'
    textColor: string;       // default '#000000'
    borderRadius: number;    // default 8
    padding: number;         // default 16
    titleFontSize: number;   // default 16
    bodyFontSize: number;    // default 14
  };
  beacon: {
    color: string;   // default '#FFFFFF'
    opacity: number; // default 0.7
  };
};
```

Example -- dark overlay with a colored tooltip:

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

Pass a `tooltip` component to `TourProvider` to replace the default tooltip entirely:

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
      <Text>{stepIndex + 1} / {totalSteps}</Text>
      <Button onPress={onNext} label="Next" />
      <Button onPress={onDismiss} label="Skip" />
    </View>
  );
}

<TourProvider tooltip={MyTooltip}>
  {/* ... */}
</TourProvider>
```

---

## Controlling tours from outside the tree

`useTourActions()` works inside any component descendant of `TourProvider`. For cases where you need to trigger a tour from outside React -- a push notification handler, a native callback -- pass a `ref` to `TourProvider`:

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

The handle exposes: `start`, `next`, `prev`, `goTo`, `pause`, `resume`, `dismiss`, `reset`, `enqueue`.

---

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the development workflow and how to send a pull request.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
