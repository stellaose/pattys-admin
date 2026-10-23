/* eslint-disable react-hooks/set-state-in-effect */


"use client";

import { Provider } from "react-redux";
import { MotionConfig } from "framer-motion";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "#/store";
import { useEffect, useState } from "react";
import { Loader } from "#components/general";


export function Providers({ children }: { children: React.ReactNode }) {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <MotionConfig reducedMotion="user">
        <Provider store={store}>{children}</Provider>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Provider store={store}>
        <PersistGate loading={<Loader />} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </MotionConfig>
  );
}
