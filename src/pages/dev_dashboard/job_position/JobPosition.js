import {Button, IconButton, Tooltip} from "@mui/material";
import Paper from "@mui/material/Paper";
import {DataGrid} from "@mui/x-data-grid";
import * as React from "react";
import {useEffect, useState} from "react";
import {deleteJobPosition, getJobPosition, updateJobPosition} from "../../../api/jobPosition";
import CreateJobPosition from "./developer-dashboard-job-position/create";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {deleteMenu, updateMenu} from "../../../api/menu";
import AlertDialog from "../../../components/Modal";

const JobPosition = () => {
  const [createModal, setCreateModal] = useState(false);
  const [jobPosition, setJobPosition] = useState([]);
  const [editData, setEditData] = useState(null);
  const [data, setData] = useState('');
  const [open, setOpen] = useState(false);

  const columns = [
    {field: 'title', headerName: 'Title', width: 150, editable: true},
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
  ]

  const paginationModel = {page: 0, pageSize: 5};

  useEffect(() => {
    get();
  }, []);

  function get() {
    getJobPosition().then(response => {
      if (response.status === 200) {
        setJobPosition(response.data);
      } else if (response.status === 204) {
        setJobPosition([]);
      }
    })
  }

  function handleEdit(row) {
    if (editData?.id) {
      setData({
        header: "Edit Job Position",
        message: "Are you sure you want to edit this Job Position?",
        type: 0,
        data: editData
      });
      setOpen(true);
    }
  }

  function handleRowEdit(row) {
    setEditData(row);
  }

  function handleDelete(row) {
    setData({
      header: "Delete Job Position",
      message: "Are you sure you want to delete this Job Position?",
      type: 1,
      data: row
    });
    setOpen(true);
  }

  function agreement(data) {
    if (data.type === 0) {
      updateJobPositionFunc(data.data);
    } else {
      deleteJobPositionFunc(data.data)
    }
  }

  function updateJobPositionFunc(data) {
    const {title, description, id} = data;
    const json = {
      title: title,
      description: description
    }

    updateJobPosition(id, json).then((response) => {
      setOpen(false);
      setCreateModal(false);
      get();
    })
  }

  function deleteJobPositionFunc(id) {
    deleteJobPosition(id).then((response) => {
      setOpen(false);
      setCreateModal(false);
      console.log("No. 1: deleteJobPosition")
      get();
    })
  }

  return (
    <>
      {
        !createModal && (
          <>
            <Button variant="contained" className="my-3" onClick={() => setCreateModal(true)}>Create</Button>
            <Paper sx={{height: 400, width: '100%'}}>
              <DataGrid
                rows={jobPosition}
                columns={columns}
                initialState={{pagination: {paginationModel}}}
                pageSizeOptions={[5, 10]}
                sx={{border: 0}}
                processRowUpdate={handleRowEdit}
              />
            </Paper>
          </>
        )}
      {createModal && (<CreateJobPosition setVisible={setCreateModal} get={get}/>)}
      <AlertDialog open={open} setOpen={setOpen} data={data} agreement={agreement}/>


    </>
  );

}

export default JobPosition;
