"use client";

import React, { Suspense, useEffect } from "react";

import { useAuth } from "./context";

function Authed({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    const refresh = async () => {
      await auth.refreshUser();
    };

    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array with eslint disable

  return (
    <>
      <Suspense>{auth.isAuthenticated && children}</Suspense>
    </>
  );
}

export default Authed;
