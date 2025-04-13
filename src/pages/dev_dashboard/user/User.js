import React, {useEffect, useState} from "react";
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import {deleteUser, getUser} from "../../../api/user";
import CreateUser from "../user/developer-dashboard-user/create";
import AlertDialog from "../../../components/Modal";
import UpdateUser from "./developer-dashboard-user/update";
import DocumentList from "./developer-dashboard-user/document";
import SetWorkingParameters from "./developer-dashboard-user/userTotalAttendance";
import {getJobPosition} from "../../../api/jobPosition";
import EmailForwardingInterface from "./developer-dashboard-user/email";

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState({
    full_name: '',
    username: '',
    email: '',
    role: '',
    job_position: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [documentModal, setDocumentModal] = useState(false);
  const [mailVisible, setMailVisible] = useState(false);
  const [attendanceModal, setAttendanceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [jobPositions, setJobPositions] = useState([]);
  const [alertDialog, setAlertDialog] = useState({open: false, data: null});

  useEffect(() => {
    fetchUsers();
    fetchJobPositions();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, advancedSearch]);

  useEffect(() => {
    fetchUsers()
  }, [editModal]);

  const filterUsers = () => {
    let filtered = [...users];

    if (advancedSearch.full_name) {
      console.log(advancedSearch.full_name);
      filtered = filtered.filter(user =>
      {
        console.log(JSON.stringify(user) + " Drugo za stampu")
       return user?.full_name?.toLowerCase().includes(advancedSearch?.full_name?.toLowerCase())
      }
      );
    }
    if (advancedSearch.username) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(advancedSearch.username.toLowerCase())
      );
    }
    if (advancedSearch.email) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(advancedSearch.email.toLowerCase())
      );
    }
    if (advancedSearch.role) {
      filtered = filtered.filter(user =>
        user.role.name.toLowerCase().includes(advancedSearch.role.toLowerCase())
      );
    }

    if (advancedSearch.job_position) {
      const filter = jobPositions?.find(job =>
        job.title.toLowerCase().includes(advancedSearch.job_position.toLowerCase())
      );
      filtered = filtered.filter(user =>
        user?.job_position_id === filter?.id
      );
    }

    setFilteredUsers(filtered);
  };

  const fetchJobPositions = async () => {
    try {
      const response = await getJobPosition();
      if (response.status === 200) {
        setJobPositions(response.data);
      } else {
        setJobPositions([]);
      }
    } catch (error) {
      console.error("Failed to fetch job positions:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUser();
      setUsers(response.status === 200 ? response.data : []);
      setFilteredUsers(response.status === 200 ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModal(true);
  };

  const handleDeleteClick = (userId) => {
    setAlertDialog({
      open: true,
      data: {
        header: "Delete User",
        message: "Are you sure you want to delete this user?",
        type: 1,
        data: userId,
      },
    });
  };

  const handleAlertDialogClose = () => {
    setAlertDialog({open: false, data: null});
  };

  const handleAdvancedSearchChange = (e) => {
    const {name, value} = e.target;
    setAdvancedSearch(prev => ({...prev, [name]: value}));
  };

  const clearAdvancedSearch = () => {
    setAdvancedSearch({
      full_name: '',
      username: '',
      email: '',
      role: '',
      job_position: ''
    });
  };

  const handleAlertDialogAgree = async (data) => {
    if (data.type === 1) {
      try {
        await deleteUser(data.data);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
    handleAlertDialogClose();
  };

  return (
    <Box sx={{width: "100%"}}>
      {!createModal && !editModal && !documentModal && !attendanceModal && !mailVisible && (
        <Card elevation={3} sx={{borderRadius: 2}}>
          <CardHeader
            title={<Typography variant="h5">User Management</Typography>}
            action={
              <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setCreateModal(true)}>
                Create New User
              </Button>
            }
          />
          <Divider/>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Full name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Job position</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="full_name"
                        onChange={handleAdvancedSearchChange}
                        placeholder="Full name"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="username"
                        onChange={handleAdvancedSearchChange}
                        placeholder="Username"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="email"
                        onChange={handleAdvancedSearchChange}
                        placeholder="Email"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="role"
                        onChange={handleAdvancedSearchChange}
                        placeholder="Role"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="job_position"
                        onChange={handleAdvancedSearchChange}
                        placeholder="Job position"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
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
                  {
                    filteredUsers.length > 0 ?
                      (
                        filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                          <TableRow key={user.id} hover>
                            <TableCell>{user.first_name + " " + user.last_name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role.name || "N/A"}</TableCell>
                            <TableCell>{jobPositions?.find(job => job.id === user?.job_position_id)?.title || "N/A"}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit">
                                  <IconButton color="primary" onClick={() => handleEditClick(user)}>
                                    <EditIcon/>
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton color="error" onClick={() => handleDeleteClick(user.id)}>
                                    <DeleteIcon/>
                                  </IconButton>
                                </Tooltip>

                                {/*<Tooltip title="Delete">*/}
                                {/*  <IconButton color="error" onClick={() => {*/}
                                {/*    setMailVisible(true)*/}
                                {/*    setUserAddress(user.email)*/}
                                {/*  }}>*/}
                                {/*    <DeleteIcon/>*/}
                                {/*  </IconButton>*/}
                                {/*</Tooltip>*/}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{py: 3}}>
                            <Typography variant="body1" color="text.secondary">
                              No users found
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={users.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}
      {editModal && <UpdateUser setUpdateModal={setEditModal} get={fetchUsers} editData={selectedUser}/>}
      {createModal && <CreateUser setCreateModal={setCreateModal} get={fetchUsers}/>}
      {documentModal && <DocumentList data={selectedUser} setDocumentVisible={setDocumentModal}/>}
      {mailVisible && <EmailForwardingInterface address={userAddress} setMailVisible={setMailVisible}/>}
      {attendanceModal &&
        <SetWorkingParameters setModalOpen={setAttendanceModal} get={fetchUsers} data={selectedUser}/>}
      <AlertDialog open={alertDialog.open} setOpen={handleAlertDialogClose} data={alertDialog.data}
                   agreement={handleAlertDialogAgree}/>
    </Box>
  );
};

export default User;
