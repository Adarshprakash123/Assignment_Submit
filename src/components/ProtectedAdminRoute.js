import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ProtectedAdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const response = await axios.get("/api/user/admin-status");
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        router.push("/");
      }
      setLoading(false);
    };

    if (isLoaded) {
      checkAdminStatus();
    }
  }, [user, isLoaded, router]);

  if (loading || !isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    router.push("/");
    return null;
  }

  return children;
};

export default ProtectedAdminRoute;
