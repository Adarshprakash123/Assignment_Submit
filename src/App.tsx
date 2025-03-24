
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Index from "./pages/Index";
import History from "./pages/History";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import Navbar from "./components/layout/Navbar";
import PageTransition from "./components/layout/PageTransition";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <PageTransition>
                <Index />
              </PageTransition>
            } />
            <Route path="/history" element={
              <PageTransition>
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/results" element={
              <PageTransition>
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/admin" element={
              <PageTransition>
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
