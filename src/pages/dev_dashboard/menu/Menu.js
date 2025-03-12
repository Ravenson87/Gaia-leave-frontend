import * as React from 'react';
import {Button, IconButton, Tooltip} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import {DataGrid} from "@mui/x-data-grid";
import {useEffect, useState} from "react";
import {deleteMenu, getMenu, updateMenu} from "../../../api/menu";
import CreateMenu from "./developer-dashboard-menu/create";
import AlertDialog from "../../../components/Modal";
import {deleteRole, updateRole} from "../../../api/role";


const Menu = () => {
  const [createModal, setCreateModal] = useState(false);
  const [menu, setMenu] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState('');
  const [editData, setEditData] = useState(null);

  const columns = [
    {field: 'menu_number', headerName: 'Menu number', width: 50},
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

  function get(){
    getMenu().then(response => {
      if(response.status === 200){
        setMenu(response.data);
      }
    })
  }

  function handleEdit(row) {
    if (editData?.id) {
      console.log(editData.id);
      setData({
        header: "Edit menu",
        message: "Are you sure you want to edit this menu?",
        type: 0,
        data: editData
      });
      setOpen(true);
    }
  }

  function handleDelete(row){
    setData({
      header: "Delete menu",
      message: "Are you sure you want to delete this menu?",
      type: 1,
      data: row
    });
    setOpen(true);
  }

  function handleRowEdit(row){
    setEditData(row);
  }

  function agreement(data) {
    if (data.type === 0) {
      console.log(data);
      updateMenuFunc(data.data);
    } else {
      console.log(data);
      deleteMenuFunc(data.data)
    }
  }

  function updateMenuFunc(data) {
    const {menu_number ,name, description, id} = data;
    const json = {
      menu_number : menu_number,
      name: name,
      description: description,
    }
    console.log(json);
    updateMenu(id, json).then((response) => {
      console.log('Update menu');
      setOpen(false);
      setCreateModal(false);
      get();
    })
  }

  function deleteMenuFunc(id) {
    deleteMenu(id).then((response) => {
      setOpen(false);
      setCreateModal(false);
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
                    rows={menu}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0}}
                    processRowUpdate={handleRowEdit}
                  />
                </Paper>
              </>
            )}
          {createModal && (<CreateMenu setVisible={setCreateModal} get={get} />)}
          <AlertDialog open={open} setOpen={setOpen} data={data} agreement={agreement}/>

        </>
    );

}
export default Menu;
