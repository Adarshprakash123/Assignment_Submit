
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Your Clerk publishable key
const PUBLISHABLE_KEY = "pk_test_bGlnaHQtZ3JhY2tsZS0yMC5jbGVyay5hY2NvdW50cy5kZXYk"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/results"
      afterSignUpUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
