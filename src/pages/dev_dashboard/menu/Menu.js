import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {deleteMenu, getMenu} from '../../../api/menu';
import CreateMenu from './developer-dashboard-menu/create';
import AlertDialog from '../../../components/Modal';
import UpdateMenu from "./developer-dashboard-menu/update";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [alertDialog, setAlertDialog] = useState({ open: false, data: null });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenu();
      if (response.status === 200) {
        setMenu(response.data);
      } else {
        setMenu([]);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  const handleEditClick = (menuItem) => {
    setSelectedMenu(menuItem);
    setUpdateModal(true);
  };

  const handleDeleteClick = (menuId) => {
    setAlertDialog({
      open: true,
      data: {
        header: 'Delete Menu',
        message: 'Are you sure you want to delete this menu item?',
        type: 1,
        data: menuId
      }
    });
  };

  const handleAlertDialogClose = () => {
    setAlertDialog({ open: false, data: null });
  };

  const handleAlertDialogAgree = async (data) => {
    if (data.type === 1) {
      try {
        await deleteMenu(data.data);
        fetchMenu();
      } catch (error) {
        console.error('Failed to delete menu:', error);
      }
    }
    handleAlertDialogClose();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!createModal && !updateModal && (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardHeader
            title={<Typography variant="h5">Menu Management</Typography>}
            action={
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateModal(true)}>
                Create New Menu
              </Button>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Menu Number</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Last Modified Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menu.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.menu_number}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description || 'N/A'}</TableCell>
                      <TableCell>{item.created_by || 'N/A'}</TableCell>
                      <TableCell>{new Date(item.created_date).toLocaleString()}</TableCell>
                      <TableCell>{new Date(item.last_modified_date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton color="primary" onClick={() => handleEditClick(item)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={menu.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}
      {createModal && <CreateMenu setVisible={setCreateModal} get={fetchMenu} editData={selectedMenu} />}
      {updateModal && (
        <UpdateMenu
          setUpdateModal={setUpdateModal}
          get={fetchMenu}
          editData={selectedMenu}
        />
      )}
      <AlertDialog open={alertDialog.open} setOpen={handleAlertDialogClose} data={alertDialog.data} agreement={handleAlertDialogAgree} />
    </Box>
  );
};

export default Menu;
