import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {deleteRole, getRole} from "../../../api/role";
import CreateRole from "../role/developer-dashboard-role/create";
import AlertDialog from "../../../components/Modal";
import UpdateRole from '../role/developer-dashboard-role/update';

const Role = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState({
    id: '',
    name: '',
    description: '',
    created_by: '',
    created_date: '',
    last_modified_by: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    data: null
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    filterAdvancedSearch();
  }, [roles, advancedSearch, showAdvancedSearch]);

  const fetchRoles = async () => {
    try {
      const response = await getRole();
      if (response.status === 200) {
        setRoles(response.data);
        setFilteredRoles(response.data);
      } else if (response.status === 204) {
        setRoles([]);
        setFilteredRoles([]);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const filterAdvancedSearch = () => {
    let filtered = [...roles];
    const hasAdvancedSearchValues = Object.values(advancedSearch).some(value => value.trim() !== '');
    if (!hasAdvancedSearchValues) {
      setFilteredRoles(roles);
      return;
    }

    if (advancedSearch.name) {
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(advancedSearch.name.toLowerCase())
      );
    }

    if (advancedSearch.description) {
      filtered = filtered.filter(role =>
        role.description && role.description.toLowerCase().includes(advancedSearch.description.toLowerCase())
      );
    }

    if (advancedSearch.created_by) {
      filtered = filtered.filter(role =>
        role.created_by && role.created_by.toLowerCase().includes(advancedSearch.created_by.toLowerCase())
      );
    }

    if (advancedSearch.created_date) {
      filtered = filtered.filter(role => {
        if (!role.created_date) return false;
        const date = new Date(role.created_date);
        return date.toLocaleDateString().includes(advancedSearch.created_date);
      });
    }

    if (advancedSearch.last_modified_by) {
      filtered = filtered.filter(role =>
        role.last_modified_by && role.last_modified_by.toLowerCase().includes(advancedSearch.last_modified_by.toLowerCase())
      );
    }

    setFilteredRoles(filtered);
  };

  const handleAdvancedSearchChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value , 'name, value ')
    setAdvancedSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearAdvancedSearch = () => {
    setAdvancedSearch({
      id: '',
      name: '',
      description: '',
      created_by: '',
      created_date: '',
      last_modified_by: '',
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setUpdateModal(true);
  };

  const handleDeleteClick = (roleId) => {
    setAlertDialog({
      open: true,
      data: {
        header: "Delete Role",
        message: "Are you sure you want to delete this role? This action cannot be undone.",
        type: 1,
        data: roleId
      }
    });
  };

  const handleAlertDialogClose = () => {
    setAlertDialog({
      ...alertDialog,
      open: false
    });
  };

  const handleAlertDialogAgree = async (data) => {
    if (data.type === 1) {
      try {
        await deleteRole(data.data);
        fetchRoles();
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
    handleAlertDialogClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const RoleCard = ({ role }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" gutterBottom>
            {role.name}
          </Typography>
          <Chip
            label={`ID: ${role.id}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {role.description || 'No description provided'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" color="text.secondary" display="block">
          Created by: {role.created_by || 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Created on: {formatDate(role.created_date)}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last modified by: {role.last_modified_by || 'N/A'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Last modified on: {formatDate(role.last_modified_date)}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditClick(role)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(role.id)}
          >
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {!createModal && !updateModal && (
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography variant="h5" component="div">
                Role Management
              </Typography>
            }
            action={
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setCreateModal(true)}
                size={isMobile ? "small" : "medium"}
              >
                Create New Role
              </Button>
            }
          />

          <Divider />

          <CardContent>
            {isMobile && (
              <Box>
                {filteredRoles.length > 0 ? (
                  filteredRoles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((role) => (
                      <RoleCard key={role.id} role={role} />
                    ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No roles found. Create one to get started.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {!isMobile && (
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="role table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                      <TableCell width="5%"><Typography variant="subtitle2">ID</Typography></TableCell>
                      <TableCell width="15%"><Typography variant="subtitle2">Name</Typography></TableCell>
                      <TableCell width="20%"><Typography variant="subtitle2">Description</Typography></TableCell>
                      <TableCell width="15%"><Typography variant="subtitle2">Created By</Typography></TableCell>
                      <TableCell width="15%"><Typography variant="subtitle2">Created Date</Typography></TableCell>
                      <TableCell width="15%"><Typography variant="subtitle2">Last Modified By</Typography></TableCell>
                      <TableCell width="15%"><Typography variant="subtitle2">Actions</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>

                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          label="Name"
                          name="name"
                          value={advancedSearch.name}
                          onChange={handleAdvancedSearchChange}
                          placeholder="Name"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          name="description"
                          onChange={handleAdvancedSearchChange}
                          placeholder="Search Description"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          name="created_by"
                          onChange={handleAdvancedSearchChange}
                          placeholder="Search Created By"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          name="created_date"
                          onChange={handleAdvancedSearchChange}
                          placeholder="Search Created Date"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          name="last_modified_by"
                          onChange={handleAdvancedSearchChange}
                          placeholder="Search Last Modified By"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Button
                            size="small"
                            onClick={clearAdvancedSearch}
                          >
                            Clear All
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRoles.length > 0 ? (
                      filteredRoles
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((role) => (
                          <TableRow
                            key={role.id}
                            hover
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{role.id}</TableCell>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>{role.description || 'N/A'}</TableCell>
                            <TableCell>{role.created_by || 'N/A'}</TableCell>
                            <TableCell>{formatDate(role.created_date)}</TableCell>
                            <TableCell>{role.last_modified_by || 'N/A'}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit role">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditClick(role)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete role">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteClick(role.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                          <Typography variant="body1" color="text.secondary">
                            No roles found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <TablePagination
              component="div"
              count={filteredRoles.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}

      {createModal && (
        <CreateRole
          setCreateModal={setCreateModal}
          get={fetchRoles}
        />
      )}

      {updateModal && (
        <UpdateRole
          setUpdateModal={setUpdateModal}
          get={fetchRoles}
          editData={selectedRole}
        />
      )}

      {alertDialog && (
        <AlertDialog
          open={alertDialog.open}
          setOpen={handleAlertDialogClose}
          data={alertDialog.data}
          agreement={handleAlertDialogAgree}
        />
      )}
    </Box>
  );
};

export default Role;
