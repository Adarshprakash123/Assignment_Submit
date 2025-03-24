import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const Navbar = () => {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await axios.get("/api/user/admin-status");
          setIsAdmin(response.data.isAdmin);
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  return (
    <nav>
      {/* Regular navigation links */}
      <Link href="/">Home</Link>
      <Link href="/quiz">Quiz</Link>
      <Link href="/history">History</Link>

      {/* Admin links - only shown to admin users */}
      {isAdmin && (
        <div className="admin-links">
          <Link href="/admin">Admin Dashboard</Link>
          <Link href="/admin/questions">Manage Questions</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
