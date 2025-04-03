import React, { useEffect, useState } from "react";
import newRequest from "../../utils/newRequest";

function Session() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIdToRemove, setUserIdToRemove] = useState("");

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await newRequest.get("/sessions/listSessions");
      setSessions(response.data.data); // Assuming API returns { data: [sessions] }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Remove all sessions for a specific user
  const handleRemoveUserSessions = async () => {
    if (!userIdToRemove) {
      alert("Please enter a User ID.");
      return;
    }

    try {
      const response = await newRequest.post("/sessions/removeUserSessions", {
        userId: userIdToRemove,
      });
      alert(response.data.message);
      fetchSessions(); // Refresh sessions list
    } catch (error) {
      console.error("Error removing user sessions:", error);
    }
  };

  // Remove a specific session by session ID
  const handleRemoveSessionById = async (sessionId) => {
    try {
      const response = await newRequest.post("/sessions/removeSessionById", {
        sessionId,
      });
      fetchSessions(); // Refresh sessions list
    } catch (error) {
      console.error("Error removing session:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const SessionCard = ({ session }) => {
    const parsedSession = JSON.parse(session.session); // Parse the session field
  
    const expiresDate = session.expires
    ? new Date(session.expires).toLocaleString()
    : "No expiration date";
  
  const lastModifiedDate = session.lastModified
    ? new Date(session.lastModified).toLocaleString()
    : "No last modified date";

  
    return (
      <div className="border border-gray-300 rounded-lg shadow-md p-4 mb-6 bg-white">
        {/* User Information */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-primary">
            {parsedSession.user.firstname} {parsedSession.user.lastname}
          </h3>
          <p className="text-sm text-gray-500">
            <strong>Email:</strong> {parsedSession.user.email}
          </p>
          <p className="text-sm text-gray-500">
            <strong>User ID:</strong> {parsedSession.user._id}
          </p>
        </div>
  
        {/* Session Information */}
        <div className="text-sm text-gray-600">
          <p>
            <strong>Session ID:</strong> {session._id}
          </p>
          <p>
            <strong>Expires:</strong> {expiresDate}
          </p>
          <p>
            <strong>Last Modified:</strong> {lastModifiedDate}
          </p>
        </div>
  
        {/* Remove Session Button */}
        <button
          onClick={() => handleRemoveSessionById(session._id)} // Session ID passed directly
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Remove Session
        </button>
      </div>
    );
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-primary mb-6">Session Management</h1>

      {/* Remove User Sessions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Remove All Sessions for a User</h2>
        <input
          type="text"
          value={userIdToRemove}
          onChange={(e) => setUserIdToRemove(e.target.value)}
          placeholder="Enter User ID"
          className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-sm"
        />
        <button
          onClick={handleRemoveUserSessions}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Remove All Sessions
        </button>
      </div>

      {/* Display All Sessions */}
      {loading ? (
        <div className="text-center text-gray-500">Loading sessions...</div>
      ) : sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No active sessions found.</div>
      )}
    </div>
  );
}

export default Session;

