"use client";

import { SessionProvider } from "next-auth/react";

// Wrapper ini dibutuhkan karena SessionProvider harus di Client Component
// tapi layout.jsx adalah Server Component
export default function SessionWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}