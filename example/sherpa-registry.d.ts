import 'react-native-sherpa';

declare module 'react-native-sherpa' {
  interface SherpaRegistry {
    'basic-tour': {
      steps: 'avatar' | 'follow-button' | 'bio' | 'stats';
    };
  }
}
