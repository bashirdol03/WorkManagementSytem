import React, { useEffect, useState } from 'react';
import { getDateFormat } from '../../utils/helpers';
import newRequest from '../../utils/newRequest';
import ProjectForm from './ProjectForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);

  const getAllProjects = async () => {
    try {
      const response = await newRequest.get("/projects/getAllProjects");
      console.log(response.data);
      setProjects(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  const onDelete = async (values) => {
    try {
      const response = await newRequest.delete(`/projects/deleteProject/${values._id}`);
      console.log(response.data);
      setShow(false);
      getAllProjects();
    } catch (err) {
      console.log(err);
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <span
        className={`font-semibold px-2 py-1 rounded ${
          rowData.status.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {rowData.status.toUpperCase()}
      </span>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return <span className="text-gray-600">{getDateFormat(rowData.createdAt)}</span>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => onDelete(rowData)}
          tooltip="Delete Project"
          tooltipOptions={{ position: 'top' }}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-info"
          onClick={() => {
            setSelectedProject(rowData);
            setShow(true);
          }}
          tooltip="Edit Project"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <p className="text-sm text-gray-500">Manage all your projects efficiently.</p>
      </div>

      {/* Add Project Button */}
      <div className="flex justify-end mb-4">
        <Button
          label="Add Project"
          icon="pi pi-plus"
          className="p-button-lg p-button-primary"
          onClick={() => {
            setShow(true);
            setSelectedProject(null);
          }}
        />
      </div>

      {/* Projects DataTable */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <DataTable
          value={projects}
          paginator
          rows={5}
          className="p-datatable-striped"
          emptyMessage="No projects available."
        >
          <Column field="name" header="Name" sortable />
          <Column field="description" header="Description" sortable />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column field="createdAt" header="Created At" body={dateBodyTemplate} sortable />
          <Column body={actionBodyTemplate} header="Actions" />
        </DataTable>
      </div>

      {/* Project Form Dialog */}
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          reloadData={getAllProjects}
          project={selectedProject}
        />
      )}
    </div>
  );
}

export default Projects;
