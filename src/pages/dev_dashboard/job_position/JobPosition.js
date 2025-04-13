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
import {deleteJobPosition, getJobPosition} from "../../../api/jobPosition";
import CreateJobPosition from "./developer-dashboard-job-position/create";
import AlertDialog from "../../../components/Modal";
import UpdateRole from "../role/developer-dashboard-role/update";
import UpdateJobPosition from "./developer-dashboard-job-position/update";

const JobPosition = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState(null);
  const [alertDialog, setAlertDialog] = useState({open: false, data: null});
  const [advancedSearch, setAdvancedSearch] = useState({
    id: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchJobPositions();
  }, []);

  useEffect(() => {
    filterAdvancedSearch();
  }, [advancedSearch]);

  const fetchJobPositions = async () => {
    try {
      const response = await getJobPosition();
      if (response.status === 200) {
        setJobPositions(response.data);
        setFilteredJobs(response.data);
      } else {
        setJobPositions([]);
        setFilteredJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch job positions:", error);
    }
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setUpdateModal(true);
  };

  const handleDeleteClick = (jobId) => {
    setAlertDialog({
      open: true,
      data: {
        header: "Delete Job Position",
        message: "Are you sure you want to delete this job position?",
        type: 1,
        data: jobId,
      },
    });
  };

  const filterAdvancedSearch = () => {
    let filtered = [...jobPositions];
    const hasAdvancedSearchValues = Object.values(advancedSearch).some(value => value.trim() !== '');
    if (!hasAdvancedSearchValues) {
      setFilteredJobs(jobPositions);
      return;
    }

    if (advancedSearch.title) {
      filtered = filtered.filter(role =>
        role.title.toLowerCase().includes(advancedSearch.title.toLowerCase())
      );
    }

    if (advancedSearch.description) {
      filtered = filtered.filter(role =>
        role.description && role.description.toLowerCase().includes(advancedSearch.description.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  };

  const handleAdvancedSearchChange = (e) => {
    const {name, value} = e.target;
    setAdvancedSearch(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearAdvancedSearch = () => {
    setAdvancedSearch({
      title: '',
      description: ''
    });
  };

  const handleAlertDialogClose = () => {
    setAlertDialog({open: false, data: null});
  };

  const handleAlertDialogAgree = async (data) => {
    if (data.type === 1) {
      try {
        await deleteJobPosition(data.data);
        fetchJobPositions();
      } catch (error) {
        console.error("Failed to delete job position:", error);
      }
    }
    handleAlertDialogClose();
  };

  return (
    <Box sx={{width: "100%"}}>
      {!createModal && !updateModal && (
        <Card elevation={3} sx={{borderRadius: 2}}>
          <CardHeader
            title={<Typography variant="h5">Job Position Management</Typography>}
            action={
              <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setCreateModal(true)}>
                Create New Job Position
              </Button>
            }
          />
          <Divider/>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Created By</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Last Modified By</TableCell>
                    <TableCell>Last Modified Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        label="Title"
                        name="title"
                        value={advancedSearch.title}
                        onChange={handleAdvancedSearchChange}
                        placeholder="Title"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        name="description"
                        value={advancedSearch.description}
                        onChange={handleAdvancedSearchChange}
                        placeholder="Search Description"
                      />
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
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
                  {filteredJobs?.length > 0 ? (
                    filteredJobs
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.title}</TableCell>
                          <TableCell>{item.description || "N/A"}</TableCell>
                          <TableCell>{item.created_by || "N/A"}</TableCell>
                          <TableCell>{new Date(item.created_date).toLocaleString()}</TableCell>
                          <TableCell>{item.last_modified_by || "N/A"}</TableCell>
                          <TableCell>{new Date(item.last_modified_date).toLocaleString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Edit">
                                <IconButton color="primary" onClick={() => handleEditClick(item)}>
                                  <EditIcon/>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton color="error" onClick={() => handleDeleteClick(item.id)}>
                                  <DeleteIcon/>
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{py: 3}}>
                        <Typography variant="body1" color="text.secondary">
                          No job positions found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={jobPositions.length}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}
      {updateModal && (
        <UpdateJobPosition
          setUpdateModal={setUpdateModal}
          get={fetchJobPositions}
          editData={selectedJob}
        />
      )}

      {createModal &&
        <CreateJobPosition
          setVisible={setCreateModal}
          get={fetchJobPositions}
          editData={selectedJob}
        />
      }
      <AlertDialog
        open={alertDialog.open}
        setOpen={handleAlertDialogClose}
        data={alertDialog.data}
        agreement={handleAlertDialogAgree}
      />
    </Box>
  );
};

export default JobPosition;
