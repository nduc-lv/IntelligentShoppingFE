import React from "react";
import * as Localization from "expo-localization";
import { i18n, Language } from "@/Localization";
import { NativeBaseProvider } from "native-base";
import { store, persistor } from "@/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ApplicationNavigator } from "./Navigation";
import { usePushNotifications } from "usePushNotification";
import { ToastProvider } from  "react-native-toast-notifications"
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = Language.ENGLISH;

export default function App() {
  const {expoPushToken, notification} = usePushNotifications();

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
    </NativeBaseProvider>
  );
}
