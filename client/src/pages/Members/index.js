import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useUserStore } from '../../store/userStore';
import newRequest from '../../utils/newRequest';
import MemberForm from './MemberForm';

function Members({ project, reloadData }) {
    const [showMemberForm, setShowMemberForm] = useState(false);
    const { user } = useUserStore();

    const removeMember = async (memberId) => {
        try {
            await newRequest.post(`/projects/removeMemberFromProject/`, {
                projectId: project._id,
                memberId: memberId,
            });
            reloadData();
        } catch (err) {
            console.error(err);
        }
    };

    const isOwner = project.owner._id === user?._id;

    const firstNameBodyTemplate = (rowData) => rowData.user.firstname;
    const lastNameBodyTemplate = (rowData) => rowData.user.lastname;
    const emailBodyTemplate = (rowData) => rowData.user.email;

    const roleBodyTemplate = (rowData) => {
        const roleColors = {
            OWNER: 'primary',
            ADMIN: 'info',
            EMPLOYEE: 'success',
        };
        return (
            <Tag
                value={rowData.role.toUpperCase()}
                severity={roleColors[rowData.role.toUpperCase()] || 'warning'}
                rounded
            />
        );
    };

    const actionBodyTemplate = (rowData) => (
        <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
            onClick={() => removeMember(rowData._id)}
            tooltip="Remove Member"
            disabled={rowData.user._id === user?._id}
        />
    );

    return (
        <div className="p-5 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Project Members</h2>
                    <p className="text-sm text-gray-500">
                        Manage members of your project, assign roles, and remove team members.
                    </p>
                </div>
                {isOwner && (
                    <Button
                        label="Add Member"
                        icon="pi pi-plus"
                        className="p-button-lg p-button-primary"
                        onClick={() => setShowMemberForm(true)}
                    />
                )}
            </div>

            {/* Member Table */}
            <div className="bg-white shadow rounded-lg p-4">
                <DataTable
                    value={project.members}
                    className="mt-3"
                    paginator
                    rows={5}
                    rowHover
                    emptyMessage="No members found."
                    header="Members"
                >
                    <Column field="firstname" header="First Name" body={firstNameBodyTemplate} />
                    <Column field="lastname" header="Last Name" body={lastNameBodyTemplate} />
                    <Column field="email" header="Email" body={emailBodyTemplate} />
                    <Column field="role" header="Role" body={roleBodyTemplate} />
                    {isOwner && (
                    <Column body={actionBodyTemplate} header="Action" />
                )}
                </DataTable>
            </div>

            {/* Add Member Dialog */}
            {showMemberForm && (
                <MemberForm
                    showMemberForm={showMemberForm}
                    setShowMemberForm={setShowMemberForm}
                    project={project}
                    reloadData={reloadData}
                />
            )}
        </div>
    );
}

export default Members;
