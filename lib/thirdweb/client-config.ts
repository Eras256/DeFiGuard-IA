import { createThirdwebClient } from "thirdweb";

// Create and export Thirdweb client for use throughout the app
// This client is used by ThirdwebProvider and other components
export const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});
