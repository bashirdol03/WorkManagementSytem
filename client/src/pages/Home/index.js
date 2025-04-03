import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDateFormat } from "../../utils/helpers";
import newRequest from "../../utils/newRequest";
import { useUserStore } from "../../store/userStore";

function Home() {
  const [projects, setProjects] = useState([]);
  const { user } = useUserStore();
  const navigate = useNavigate();

  // Fetch projects based on the user's role
  const getProjectsByRole = async () => {
    try {
      const response = await newRequest.get("/projects/getProjectsByRole");
      setProjects(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProjectsByRole();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-10">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">
          Welcome, {user?.firstname} {user?.lastname}
        </h1>
      </div>

      {/* Projects Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {project.name}
              </h2>

              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-sm text-gray-300">Created At</span>
                  <span className="text-sm text-gray-400">{getDateFormat(project.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-sm text-gray-300">Owner</span>
                  <span className="text-sm text-gray-400">{project.owner.firstname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-sm text-gray-300">Status</span>
                  <span className="text-sm text-gray-400">{project.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center col-span-full text-center text-lg text-gray-400">
            <h2>You have no projects yet.</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
