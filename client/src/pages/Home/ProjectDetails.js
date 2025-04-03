import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDateFormat } from "../../utils/helpers";
import { useUserStore } from "../../store/userStore";
import newRequest from "../../utils/newRequest";
import Members from "../Members";
import Tasks from "../Tasks";

function ProjectDetails() {
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [showTasks, setShowTasks] = useState(true);
  const { user } = useUserStore();
  const [project, setProject] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  // Fetch project details
  const getData = async () => {
    try {
      const response = await newRequest.get(`/projects/getProjectById/${params.id}`);
      setProject(response.data);
      const currentUser = response.data.members.find(
        (member) => member.user._id === user._id
      );
      setCurrentUserRole(currentUser.role);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  return (
    project && (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4 py-10">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold capitalize">{project?.name}</h1>
              <span className="text-gray-300 text-sm block mt-2">{project?.description}</span>
              <div className="flex gap-5 mt-4">
                <span className="text-gray-300 text-sm font-semibold">Role:</span>
                <span className="text-gray-200 text-sm uppercase">{currentUserRole}</span>
              </div>
            </div>
            <div>
              <div className="flex gap-5 mb-4">
                <span className="text-gray-300 text-sm font-semibold">Created At:</span>
                <span className="text-gray-200 text-sm">{getDateFormat(project.createdAt)}</span>
              </div>
              <div className="flex gap-5 mb-4">
                <span className="text-gray-300 text-sm font-semibold">Created By:</span>
                <span className="text-gray-200 text-sm">
                  {project.owner.firstname} {project.owner.lastname}
                </span>
              </div>
              <span
                className="text-cyan-400 cursor-pointer underline text-sm"
                onClick={() => setShowTasks(!showTasks)}
              >
                {showTasks ? "Show Members" : "Show Tasks"}
              </span>
            </div>
          </div>
        </div>

        {/* Task/Members Toggle Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg">
          {showTasks ? (
            <Tasks project={project} reloadData={getData} />
          ) : (
            <Members project={project} reloadData={getData} />
          )}
        </div>
      </div>
    )
  );
}

export default ProjectDetails;
