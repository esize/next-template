"use client";

import React, { useEffect } from "react";

import { useAuth } from "./context";

function Authed({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  // Use this if you only want to refresh once on mount
  useEffect(() => {
    const refresh = async () => {
      await auth.refreshUser();
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array with eslint disable

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  return <>{auth.isAuthenticated && children}</>;
}

export default Authed;
