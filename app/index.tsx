import React, {useEffect} from 'react';
import HomePage from './home/home';
import {initDatabase} from "../utils/database/initDb";
import NetInfo from "@react-native-community/netinfo";
import {syncAllToFirestore} from "../utils/services/sync/syncAllToFirestore";
import {View} from "react-native";

export default function Index() {
  useEffect(() => {
    console.log('App starting...');
    const setup = async () => {
      console.log('Initializing database...');
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

    setup()
  }, []);

  return <View />;
  // return <HomePage />;
}