
import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Sign In to DailyQuiz
        </h1>
        <SignIn 
          signUpUrl="/sign-up"
          redirectUrl="/results"
        />
      </div>
    </div>
  );
};

export default SignInPage;
