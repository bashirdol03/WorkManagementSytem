import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import newRequest from '../../utils/newRequest';

function TaskForm({ showTaskForm, setShowTaskForm, project, reloadData, task }) {
  const [taskDetails, setTaskDetails] = useState({
    name: task ? task.name : '',
    description: task ? task.description : '',
    assignedTo: task ? task.assignedTo.email : ''
  });

  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(task?.attachments || []);
  const { user } = useUserStore();

  const handleSubmit = async (values) => {
    try {
      if (task) {
        const response = await newRequest.post('/tasks/editTask', {
          ...taskDetails,
          _id: task._id,
          assignedTo: task.assignedTo._id
        });
        console.log(response.data);
      } else {
        const assignedToMember = project.members.find(
          (member) => member.user.email === email
        );
        const assignedToUserId = assignedToMember.user._id;
        const response = await newRequest.post('/tasks/createTask', {
          ...taskDetails,
          project: project._id,
          assignedBy: user._id,
          assignedTo: assignedToUserId
        });
        console.log(response.data);
      }
      setShowTaskForm(false);
      reloadData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prev) => ({
      ...prev,
      [name]: value
    }));
    if (name === 'assignedTo') {
      setEmail(value);
    }
  };

  const validateEmail = () => {
    const employeesInProject = project.members.filter(
      (member) => member.role === 'employee'
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };

  const uploadImage = async () => {
    if (!file) {
      console.log('No file selected for upload.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', task._id);
      const response = await newRequest.post('/tasks/uploadImage', formData);
      console.log(response.data);
      setImages([...images, response.data]);
      reloadData();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteImage = async (image) => {
    try {
      const updatedAttachments = images.filter((img) => img !== image);
      const response = await newRequest.post('/tasks/editTask', {
        ...task,
        attachments: updatedAttachments
      });
      console.log(response.data);
      setImages(updatedAttachments);
      reloadData();
    } catch (err) {
      console.log(err);
    }
  };

  const renderDialogFooter = () => (
    <React.Fragment>
      <Button label="Save Task" icon="pi pi-check" className="p-button p-button-lg p-button-success" onClick={handleSubmit} />
      <Button label="Cancel" icon="pi pi-times" className="p-button p-button-lg p-button-secondary" onClick={() => setShowTaskForm(false)} />
    </React.Fragment>
  );

  return (
    <Dialog
      header={task ? 'EDIT TASK' : 'ADD TASK'}
      visible={showTaskForm}
      onHide={() => setShowTaskForm(false)}
      style={{ width: '60vw', maxWidth: '900px' }}
      footer={renderDialogFooter()}
      className="p-fluid"
    >
      <div className="p-grid p-dir-col">
        <div className="p-field">
          <label htmlFor="name" className="font-semibold text-gray-800">Task Name</label>
          <InputText id="name" value={taskDetails.name} onChange={handleInputChange} name="name" className="p-inputtext-lg" />
        </div>

        <div className="p-field">
          <label htmlFor="description" className="font-semibold text-gray-800">Task Description</label>
          <InputTextarea
            id="description"
            value={taskDetails.description}
            onChange={handleInputChange}
            name="description"
            rows={5}
            autoResize
            className="p-inputtext-lg"
          />
        </div>

        <div className="p-field">
          <label htmlFor="assignedTo" className="font-semibold text-gray-800">Assign To</label>
          <InputText
            id="assignedTo"
            value={taskDetails.assignedTo}
            onChange={handleInputChange}
            name="assignedTo"
            disabled={!!task}
            className="p-inputtext-lg"
          />
        </div>

        {email && !validateEmail() && (
          <div className="p-message p-message-error mt-2">
            Email is not valid or employee is not in the project
          </div>
        )}
      </div>

      {task && (
        <>
          <div className="p-field mt-3">
            <FileUpload
              customUpload
              auto={false}
              onSelect={(e) => {
                if (e.files && e.files.length > 0) {
                  setFile(e.files[0]);
                }
              }}
              onError={(e) => {
                console.log('Upload Error:', e);
              }}
              chooseLabel="Select Image"
              uploadHandler={uploadImage}
              className="p-button p-button-primary"
            />
          </div>

          <div className="flex flex-wrap mt-4">
            {images.map((image, index) => (
              <div key={index} className="p-2 border-round border-1 surface-border mr-3 mb-3">
                <img src={image} alt={`attachment-${index}`} className="w-24 h-24 object-cover rounded-md shadow-sm" />
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-danger mt-1"
                  onClick={() => deleteImage(image)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </Dialog>
  );
}

export default TaskForm;
