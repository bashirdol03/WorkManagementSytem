import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import newRequest from '../../utils/newRequest';

function ProjectForm({ show, setShow, reloadData, project }) {
  const [formData, setFormData] = useState({
    name: project ? project.name : '',
    description: project ? project.description : ''
  });

  const { user } = useUserStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = {
      ...formData,
      owner: user._id,
      members: [{
        user: user._id,
        role: "owner"
      }]
    };

    try {
      if (project) {
        // Editing existing project
        values._id = project._id;
        const response = await newRequest.post("/projects/editProject", values);
        console.log(response.data);
        setShow(false);
        reloadData();
      } else {
        // Creating new project
        const response = await newRequest.post("/projects/createProject", {
          owner: user._id,
          members: [{
            user: user._id,
            role: "owner"
          }],
          ...values
        });
        console.log(response.data);
        setShow(false);
        reloadData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Dialog
      header={project ? "Edit Project" : "Add Project"}
      visible={show}
      style={{ width: '50vw', maxWidth: '600px' }}
      onHide={() => setShow(false)}
      closable={false}
      className="p-fluid"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="field">
          <label htmlFor="name" className="block text-lg font-semibold">Project Name</label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="p-inputtext-sm p-rounded p-shadow-2 w-full"
            placeholder="Enter project name"
          />
        </div>

        <div className="field">
          <label htmlFor="description" className="block text-lg font-semibold">Project Description</label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={5}
            className="p-inputtextarea-sm p-rounded p-shadow-2 w-full"
            placeholder="Enter project description"
          />
        </div>

        <div className="flex justify-between mt-4">
          <Button
            label="Cancel"
            icon="pi pi-times"
            className="p-button-text p-button-rounded p-button-secondary"
            onClick={() => setShow(false)}
          />
          <Button
            type="submit"
            label="Save"
            icon="pi pi-check"
            className="p-button p-button-primary p-button-rounded"
            autoFocus
          />
        </div>
      </form>
    </Dialog>
  );
}

export default ProjectForm;
