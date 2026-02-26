import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.25abfcf66b104783ba1bf16b1610a1ce',
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
