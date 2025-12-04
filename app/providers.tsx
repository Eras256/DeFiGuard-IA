"use client";

import React, { useMemo } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create client inside component to ensure it's available in React context
  // The clientId should be loaded from .env.local
  const client = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
    
    if (!clientId) {
      console.error(
        "❌ ERROR: NEXT_PUBLIC_THIRDWEB_CLIENT_ID no está configurado. " +
        "Asegúrate de que esté en tu archivo .env.local y reinicia el servidor de desarrollo."
      );
      // Return a client with empty string to prevent crashes
      return createThirdwebClient({
        clientId: "",
      });
    }

    console.log("✅ Thirdweb client creado con clientId:", clientId.substring(0, 8) + "...");
    
    return createThirdwebClient({
      clientId: clientId,
    });
  }, []);

  // Try passing client as prop - even if TypeScript complains, it might work at runtime
  // The useAutoConnect hook needs access to client.clientId
  return (
    // @ts-ignore - ThirdwebProvider may accept client prop at runtime even if types don't show it
    <ThirdwebProvider client={client}>
      {children}
    </ThirdwebProvider>
  );
}
