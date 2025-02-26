import React from "react";

import Authed from "@/components/auth/authed";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authed>
      <div>
        <header>
          <p>Logged in!</p>
        </header>
        <main>{children}</main>
      </div>
    </Authed>
  );
}
