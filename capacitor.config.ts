
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.41dc9143d7ec49328d14c97546895e4a',
  appName: 'mpesa-trust-circle',
  webDir: 'dist',
  server: {
    url: 'https://41dc9143-d7ec-4932-8d14-c97546895e4a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
    }
  }
};

export default config;
