import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import NetInfo from "@react-native-community/netinfo";
import { syncAllToFirestore } from "../utils/services/sync/syncAllToFirestore";
import { LanguageProvider } from '../contexts/LanguageContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useEffect } from "react";
import { initDatabase } from "../utils/database/initDb";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      console.log('✅ Database initialized');

      const unsubscribe = NetInfo.addEventListener(async (state) => {
        if (state.isConnected) {
          console.log('[NetInfo] Connected, starting sync...');
          await syncAllToFirestore();
        }
      });

      return () => {
        unsubscribe();
      };
    };

    setup().then(() => {
      console.log('App setup completed');
    });
  }, []);

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <ThemeProvider>
          <Stack 
            screenOptions={{
              headerShown: true,
              contentStyle: {
                backgroundColor: 'white',
              },
            }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="add-patient" options={{ title: "Add Patient" }} />
            <Stack.Screen name="patient/[id]" options={{ title: "Patient Details" }} />
            <Stack.Screen name="add-visit/[patientId]" options={{ title: "Add Visit" }} />
            <Stack.Screen name="visit/[id]" options={{ title: "Visit Details" }} />
            <Stack.Screen name="settings" options={{ title: "Settings" }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}