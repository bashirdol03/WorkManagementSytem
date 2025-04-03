import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import newRequest from "../utils/newRequest";
import { useQuery } from "react-query";

function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

  // 🔐 Session check (polling optional)
  const { data, isLoading } = useQuery(
    "getLoggedInUser",
    async () => {
      const response = await newRequest.get("/users/getLoggedInUser");
      return response.data;
    },
    {
      onSuccess: (data) => setUser(data),
      onError: () => {
        setUser(null);
        navigate("/login");
      },
    }
  );

  console.log(user)

  // 🚪 Logout Handler
  const handleLogout = async () => {
    try {
      await newRequest.post("/users/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // 🚨 Redirect if user not found
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);



  // ✋ Guard fallback
  if (!user) return null;

  // ✅ Protected content with header
  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-3xl font-bold cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Work Management System
          </h1>

          <nav className="flex space-x-6 items-center">
            <button
              className="text-sm font-medium py-2 px-4 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors"
              onClick={() => navigate("/projects")}
            >
              {user?.firstname}'s Projects
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors shadow-md"
              title="Logout"
            >
              <i className="ri-logout-box-fill text-lg" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}

export default ProtectedPage;

/* 

 {user?.email === adminEmail && (
              <button
                className="text-sm font-medium py-2 px-4 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                onClick={() => navigate("/adminpage")}
              >
                Admin Page
              </button>
            )}


*/
