import React, { useEffect } from "react";
import * as Localization from "expo-localization";

import { NativeBaseProvider } from "native-base";
import { Config } from "./General/Config";
import { store, persistor } from "@/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ApplicationNavigator } from "./Navigation";
import { usePushNotifications } from "usePushNotification";
import { ToastProvider } from "react-native-toast-notifications";
import { LogBox } from 'react-native';
import { i18n } from "./Localization";

export default function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs();
    i18n.locale = Localization.locale;
  }, []);
  // add a query here to push to backend 
  // then it will update date
  return (
    <NativeBaseProvider>
      <ToastProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApplicationNavigator />
          </PersistGate>
        </Provider>
      </ToastProvider>
    </NativeBaseProvider>);

}