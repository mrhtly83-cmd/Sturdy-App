export default ({ config }) => ({
  ...config,
  extra: {
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#14B8A6', // Teal from theme
  },
  ios: {
    statusBar: {
      style: 'light',
      backgroundColor: '#0F172A',
    },
  },
  android: {
    statusBar: {
      style: 'light',
      backgroundColor: '#0F172A',
      translucent: true,
    },
  },
});
