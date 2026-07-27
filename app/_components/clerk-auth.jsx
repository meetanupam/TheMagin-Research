"use client";

import { SignIn, SignUp } from "@clerk/nextjs";

export default function ClerkAuth({ mode }) {
  return (
    <main className="clerk-auth-page">
      {mode === "sign-up"
        ? <SignUp routing="path" path="/signup" fallbackRedirectUrl="/workspace" />
        : <SignIn routing="path" path="/login" fallbackRedirectUrl="/workspace" />}
    </main>
  );
}
