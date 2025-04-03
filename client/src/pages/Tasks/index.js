import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useUserStore } from '../../store/userStore';
import { getDateFormat } from '../../utils/helpers';
import newRequest from '../../utils/newRequest';
import TaskForm from './TaskForm';

function Tasks({ project, reloadData }) {
    const [showViewTask, setShowViewTask] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState(null);

    const { user } = useUserStore();

    const getTasks = async () => {
        try {
            const response = await newRequest.post('/tasks/getAllTasks', {
                project: project._id,
            });
            setTasks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    const deleteTask = async (id) => {
        try {
            await newRequest.delete(`/tasks/deleteTask/${id}`);
            getTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const editTaskStatus = async (taskId) => {
      try {
          const response = await newRequest.post('/tasks/editTaskStatus', { _id: taskId });
          console.log(response.data.successMessage);
          getTasks();
      } catch (err) {
          console.error('Error toggling task status:', err);
      }
  };

    const isEmployee = project.members.some(
        (member) => member.role === 'employee' && member.user._id === user?._id
    );

    

    const nameTemplate = (rowData) => (
        <span
            className="underline cursor-pointer text-blue-600 font-medium"
            onClick={() => {
                setTask(rowData);
                setShowViewTask(true);
            }}
        >
            {rowData.name}
        </span>
    );

    const assignedToTemplate = (rowData) => (
        <span className="font-medium text-gray-700">{`${rowData.assignedTo.firstname} ${rowData.assignedTo.lastname}`}</span>
    );

    const assignedByTemplate = (rowData) => (
        <span className="text-gray-500">{`${rowData.assignedBy.firstname} ${rowData.assignedBy.lastname}`}</span>
    );

    const createdAtTemplate = (rowData) => (
        <span className="text-gray-400">{getDateFormat(rowData.createdAt)}</span>
    );

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-sm p-button-info"
                onClick={() => {
                    setTask(rowData);
                    setShowTaskForm(true);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-sm p-button-danger"
                onClick={() => deleteTask(rowData._id)}
            />
        </div>
    );

    const statusTemplate = (rowData) => (
      <Button
          label={rowData.status === "pending" ? "Mark as Completed" : "Mark as Pending"}
          className={rowData.status === "pending" ? "p-button-success" : "p-button-secondary"}
          onClick={() => editTaskStatus(rowData._id)}
      />
  );

  // Calculate the number of pending and completed tasks
  const pendingTasksCount = tasks.filter((task) => task.status === "pending").length;
  const completedTasksCount = tasks.filter((task) => task.status === "completed").length;

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Project Tasks</h2>
                    <p className="text-sm text-gray-500">Manage all tasks related to the project.</p>
                </div>
                {!isEmployee && (
                    <Button
                        label="Add Task"
                        icon="pi pi-plus"
                        className="p-button-lg p-button-primary"
                        onClick={() => {
                            setTask(null);
                            setShowTaskForm(true);
                        }}
                    />
                )}



            </div>
             {/* Task Status Summary */}
             <div className="flex justify-between items-center bg-white p-4 mb-5 rounded-lg shadow">
                <div className="text-lg font-semibold text-gray-700">
                    Pending Tasks: <span className="text-yellow-600">{pendingTasksCount}</span>
                </div>
                <div className="text-lg font-semibold text-gray-700">
                    Completed Tasks: <span className="text-green-600">{completedTasksCount}</span>
                </div>
            </div>

            {/* Task Table */}
            <div className="bg-white shadow rounded-lg p-4">
                <DataTable
                    value={tasks}
                    className="mt-3"
                    paginator
                    rows={5}
                    rowHover
                    emptyMessage="No tasks available."
                    header="Tasks"
                >
                    <Column field="name" header="Name" body={nameTemplate} />
                    <Column field="assignedTo" header="Assigned To" body={assignedToTemplate} />
                    <Column field="assignedBy" header="Assigned By" body={assignedByTemplate} />
                    <Column field="createdAt" header="Created On" body={createdAtTemplate} />
                    <Column field="status" header="Status" body={statusTemplate} />
                    {!isEmployee && <Column body={actionTemplate} />}
                </DataTable>
            </div>

            {/* Task Form Dialog */}
            {showTaskForm && (
                <TaskForm
                    showTaskForm={showTaskForm}
                    setShowTaskForm={setShowTaskForm}
                    project={project}
                    reloadData={getTasks}
                    task={task}
                />
            )}

            {/* View Task Dialog */}
{showViewTask && (
    <Dialog
        visible={showViewTask}
        onHide={() => setShowViewTask(false)}
        header={
            <div className="p-4 bg-blue-600 text-white text-lg font-semibold rounded-t-lg shadow-lg">
                Task Details
            </div>
        }
        modal
        className="w-full max-w-xl rounded-lg p-0"
    >
        <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{task.name}</h3>
            <p className="text-base text-gray-600 mb-5">{task.description}</p>
            <div className="flex flex-wrap gap-3">
                {task.attachments.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`attachment-${index}`}
                        className="w-28 h-28 object-cover rounded-lg shadow-md border border-gray-200"
                    />
                ))}
            </div>
        </div>
    </Dialog>
)}

        </div>
    );
}

export default Tasks;
