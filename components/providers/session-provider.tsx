"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext } from "react";

// Mock session for demo mode (bypass authentication)
const mockSession = {
  user: {
    id: "demo-user-id",
    email: "demo@brandcat.app",
    name: "Demo User",
    role: "BRAND_OWNER",
    brandId: "demo-brand-id",
  },
  expires: "9999-12-31T23:59:59.999Z",
};

const MockSessionContext = createContext(mockSession);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Enable demo mode - bypass authentication
  const DEMO_MODE = true;

  if (DEMO_MODE) {
    return (
      <MockSessionContext.Provider value={mockSession}>
        {children}
      </MockSessionContext.Provider>
    );
  }

  return <SessionProvider>{children}</SessionProvider>;
}

// Export hook to use mock session in demo mode
export function useMockSession() {
  return useContext(MockSessionContext);
}
