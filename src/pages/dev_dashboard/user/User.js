import * as React from 'react';
import {DataGrid} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import {deleteUser, getUser, updateUser} from "../../../api/user";
import {Button, IconButton, Tooltip} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AlertDialog from "../../../components/Modal";
import CreateUser from "../user/developer-dashboard-user/create";
import {getJobPosition} from "../../../api/jobPosition";
import SetWorkingParameters from "./developer-dashboard-user/userTotalAttendance";
import UpdateUser from "./developer-dashboard-user/update";
import DocumentList from "./developer-dashboard-user/document";
import AssignmentIcon from '@mui/icons-material/Assignment';

const User = () => {
  const [editData, setEditData] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState('');
  const [user, setUser] = useState([]);
  const [jobPositionData, setJobPositionData] = useState(null);
  const [userTotalAttendanceVisible, setUserTotalAttendanceVisible] = useState(false);
  const [userTotalAttendanceData, setUserTotalAttendanceData] = useState(null);
  const columns = [
    {field: 'id', headerName: 'ID', width: 50},
    {field: 'first_name', headerName: 'First name', width: 150, editable: true},
    {field: 'last_name', headerName: 'Last Name', width: 150, editable: true},
    {field: 'username', headerName: 'Username', width: 150, editable: true},
    {field: 'email', headerName: 'Email', width: 150, editable: true},
    {
      field: 'role', headerName: 'Role', width: 150, editable: true,
      valueGetter: (params) => {
        return params?.name ? params?.name : 'N/A'
      }
    },
    {
      field: 'job_position_id', headerName: 'Job position', width: 150, editable: true,
      valueGetter: (params) => getJobPositionName(params)
    },
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
            <Tooltip title="Total attendance" className='mx-lg-2'>
              <IconButton color="primary" onClick={() => handleTotalAttendance(params.row)}>
                <CalendarTodayIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="View Document" className='mx-lg-2'>
              <IconButton color="primary" onClick={() => {
                setDocumentVisible(true)
                setDocumentData(params.row)
              }}>
                <AssignmentIcon/>
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
    fetchData();
  }, []);

  function get() {
    getUser().then((response) => {
      if (response.status === 200) {
        setUser(response.data);
      } else if (response.status === 204) {
        setUser([]);
      }
    })
  }

  function fetchData() {
    getJobPosition().then(r => {
      if (r.status === 200) {
        setJobPositionData(r.data)
      }
    });
  }

  function getJobPositionName(job_position_id) {
    const jobPosition = jobPositionData.find(r => r.id === job_position_id);
    return jobPosition ? jobPosition.title : "N/A";
  }

  function handleEdit(data) {
    setEditData(data);
    setEditVisible(true);
    if (editData?.id) {
      setData({
        header: "Edit user",
        message: "Are you sure you want to edit this user?",
        type: 0,
        data: editData
      });
      setOpen(true);
    }
  }

  function handleDelete(row) {
    setData({
      header: "Delete user",
      message: "Are you sure you want to delete this user?",
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
      updateUserFunc(data.data);
    } else {
      deleteUserFunc(data.data)
    }
  }

  function updateUserFunc(data) {
    const {name, description, id} = data;
    const json = {
      name: name,
      description: description,
    }
    updateUser(id, json).then((response) => {
      setOpen(false);
      setCreateModal(false);
      get();
    })
  }

  function deleteUserFunc(id) {
    deleteUser(id).then((response) => {
      setOpen(false);
      setCreateModal(false);
      get();
    })
  }

  function handleTotalAttendance(data) {
    console.log(data)
    setUserTotalAttendanceVisible(true);
    setUserTotalAttendanceData(data);
  }

  return (
    <>
      {!createModal && !userTotalAttendanceVisible && !editVisible && !documentVisible && (
        <>
          <Button variant="contained" className="my-3" onClick={() => setCreateModal(true)}>Create</Button>
          <Paper sx={{height: 400, width: '100%'}}>
            <DataGrid
              rows={user}
              columns={columns}
              initialState={{pagination: {paginationModel}}}
              pageSizeOptions={[5, 10]}
              sx={{border: 0}}
              processRowUpdate={handleRowEdit}
            />
          </Paper>
        </>
      )}
      {createModal && (<CreateUser setCreateModal={setCreateModal} get={get}/>)}
      {editVisible && (<UpdateUser setUpdateModal={setEditVisible} get={get} editData={editData}/>)}
      {documentVisible && (<DocumentList data={documentData} setDocumentVisible={setDocumentVisible}/>)}
      {userTotalAttendanceVisible && (
        <SetWorkingParameters setModalOpen={setUserTotalAttendanceVisible} get={get} data={userTotalAttendanceData}/>)
      }
      <AlertDialog open={open} setOpen={setOpen} data={data} agreement={agreement}/>
    </>
  )
}
export default User
