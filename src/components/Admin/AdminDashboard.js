import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const AdminDashboard = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users from your MongoDB API endpoint
        const response = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user.id}`, // or however you handle auth
          },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Attempts</h3>
          <p>
            {users.reduce((sum, user) => sum + (user.totalAttempts || 0), 0)}
          </p>
        </div>
        <div className="stat-card">
          <h3>Total Correct Answers</h3>
          <p>
            {users.reduce((sum, user) => sum + (user.totalCorrect || 0), 0)}
          </p>
        </div>
      </div>

      <div className="users-table">
        <h3>Registered Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Total Attempts</th>
                <th>Correct Answers</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{user.totalAttempts || 0}</td>
                  <td>{user.totalCorrect || 0}</td>
                  <td>
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
