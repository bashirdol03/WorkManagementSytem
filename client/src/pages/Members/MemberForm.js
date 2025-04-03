import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import newRequest from '../../utils/newRequest';

function MemberForm({ showMemberForm, setShowMemberForm, reloadData, project }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Employee', value: 'employee' }
  ];

  const handleSubmit = async () => {
    try {
      const emailExists = project.members.find(
        (member) => member.user.email === email
      );
      if (emailExists) {
        console.log('User is already a member of this project');
        return;
      } else {
        const response = await newRequest.post('/projects/addMemberToProject', {
          projectId: project._id,
          email,
          role
        });
        console.log(response.data);
        setShowMemberForm(false);
        reloadData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderFooter = () => {
    return (
      <div className="p-d-flex p-jc-between">
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setShowMemberForm(false)} />
        <Button label="Add" icon="pi pi-check" onClick={handleSubmit} className="p-button p-button-success" />
      </div>
    );
  };

  return (
    <Dialog
      header="Add Member"
      visible={showMemberForm}
      onHide={() => setShowMemberForm(false)}
      footer={renderFooter()}
      modal
      style={{ width: '50vw', maxWidth: '600px' }}
      className="p-fluid"
    >
      <div className="p-grid p-dir-col">
        <div className="p-field">
          <label htmlFor="email" className="font-semibold text-gray-800">Email</label>
          <InputText
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter member's email"
            className="p-inputtext-lg"
          />
        </div>

        <div className="p-field">
          <label htmlFor="role" className="font-semibold text-gray-800">Role</label>
          <Dropdown
            id="role"
            value={role}
            options={roles}
            onChange={(e) => setRole(e.value)}
            placeholder="Select Role"
            className="p-dropdown-lg"
          />
        </div>
      </div>
    </Dialog>
  );
}

export default MemberForm;
