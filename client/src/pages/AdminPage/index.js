import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await newRequest.get("/users/listAllUsers"); // API to fetch all users
      setUsers(response.data.data); // Assuming API returns { data: [users] }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>

      {/* Navigation Links */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => navigate("/sessions")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View Sessions
        </button>
        <button
          onClick={() => navigate("/logs")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View Logs
        </button>
      </div>

      {/* User Management */}
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="border border-gray-300 rounded-lg shadow-md p-4 bg-white"
            >
              <h3 className="font-bold text-lg text-primary">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-sm text-gray-500">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-gray-500">
                <strong>User ID:</strong> {user._id}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Created:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
}

export default AdminPage;
