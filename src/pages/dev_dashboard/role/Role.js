import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {deleteRole, getRole, updateRole} from "../../../api/role";
import {Button, IconButton, Tooltip} from "@mui/material";
import CreateRole from "/developer-dashboard-role/create";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AlertDialog from "../../../components/Modal";

const Role = () => {
    const [editData, setEditData] = useState(null);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState('');
    const [role, setRole] = useState([]);
    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'name', headerName: 'Name', width: 150, editable: true},
        {field: 'description', headerName: 'Description', width: 250, editable: true},
        {
            field: 'created_by',
            headerName: 'Created By',
            width: 150,
        },
        {
            field: 'created_date',
            headerName: 'Created Date',
            width: 200,
        },
        {
            field: 'last_modified_by',
            headerName: 'Last Modified By',
            width: 150,
        },
        {
            field: 'last_modified_date',
            headerName: 'Last Modified Date',
            width: 200,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 500,
            renderCell: (params) => {
                return (
                    <>
                        <Tooltip title="Edit">
                            <IconButton color="secondary" onClick={() => handleEdit(params.row)}>
                                <EditIcon/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete" className='mx-lg-2'>
                            <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>
                    </>
                );
            }
        }
    ];
    const paginationModel = {page: 0, pageSize: 5};

    useEffect(() => {
        get();
    }, []);

    function get() {
        getRole().then((response) => {
            if (response.status === 200) {
                setRole(response.data);
            }
        })
    }

    function handleEdit(row) {
        if (editData?.id) {
            setData({
                header: "Edit role",
                message: "Are you sure you want to edit this role?",
                type: 0,
                data: editData
            });
            setOpen(true);
        }
    }

    function handleDelete(row) {
        setData({
            header: "Delete role",
            message: "Are you sure you want to delete this role?",
            type: 1,
            data: row
        });
        setOpen(true);
    }

    function handleRowEdit(row) {
        setEditData(row);
    }

    function agreement(data) {
        if (data.type === 0) {
            updateRoleFunc(data.data);
        } else {
            deleteRoleFunc(data.data)
        }
    }

    function updateRoleFunc(data) {
        const {name, description, id} = data;
        const json = {
            name: name,
            description: description,
        }
        updateRole(id, json).then((response) => {
            setOpen(false);
            setCreateModal(false);
            get();
        })
    }

    function deleteRoleFunc(id) {
        deleteRole(id).then((response) => {
            setOpen(false);
            setCreateModal(false);
            get();
        })
    }

    return (
        <>
            {!createModal && (
                <>
                    <Button variant="contained" className="my-3" onClick={() => setCreateModal(true)}>Create</Button>
                    <Paper sx={{height: 400, width: '100%'}}>
                        <DataGrid
                            rows={role}
                            columns={columns}
                            initialState={{pagination: {paginationModel}}}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            sx={{border: 0}}
                            processRowUpdate={handleRowEdit}
                        />
                    </Paper>
                </>
            )}
            {createModal && (<CreateRole setCreateModal={setCreateModal} get={get}/>)}
            <AlertDialog open={open} setOpen={setOpen} data={data} agreement={agreement}/>
        </>
    )
}
export default Role