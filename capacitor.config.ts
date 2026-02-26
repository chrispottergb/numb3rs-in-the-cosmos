import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.highfrequencyholdings.numb3rs',
  appName: 'Numb3rs In The Cosmos',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'App'
  }
};

export default config;
