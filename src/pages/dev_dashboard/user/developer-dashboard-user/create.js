import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {createUser} from '../../../../api/user';
import {getJobPosition} from '../../../../api/jobPosition';
import {getRole} from '../../../../api/role';

const CreateUser = ({setCreateModal, get}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    jobPosition: null,
    role: null
  });

  const [roleData, setRoleData] = useState([]);
  const [jobPositionData, setJobPositionData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobPositions, roles] = await Promise.all([
        getJobPosition(),
        getRole()
      ]);

      if (jobPositions.status === 200) {
        setJobPositionData(jobPositions.data);
      }

      if (roles.status === 200) {
        setRoleData(roles.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.jobPosition) {
      newErrors.jobPosition = 'Job position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({...toast, open: false});
  };

  const showToast = (message, severity) => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const saveData = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const jsonData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        role_id: formData.role.id,
        job_position_id: formData.jobPosition.id,
        status: 1,
      };

      const response = await createUser(jsonData);

      if (response.status === 201) {
        showToast("User successfully created!", "success");
        get();
        setCreateModal(false);
      } else {
        showToast(response.response?.data?.message || "Failed to create user. Please try again.", "error");
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create user. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          width: '100%',
          overflow: 'visible',
          position: 'relative',
          borderRadius: 2
        }}
      >
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonAddIcon color="primary"/>
              <Typography variant="h6">Create New User</Typography>
            </Stack>
          }
          action={
            <IconButton
              onClick={() => setCreateModal(false)}
              aria-label="close"
              size="small"
              sx={{
                bgcolor: theme.palette.grey[100],
                '&:hover': {bgcolor: theme.palette.grey[200]}
              }}
            >
              <CloseIcon fontSize="small"/>
            </IconButton>
          }
          sx={{
            pb: 1,
            '& .MuiCardHeader-action': {m: 0}
          }}
        />

        <Divider/>

        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.jobPosition}>
                <InputLabel id="job-position-label">Job Position</InputLabel>
                <Select
                  labelId="job-position-label"
                  id="job-position-select"
                  value={formData.jobPosition}
                  onChange={handleInputChange('jobPosition')}
                  label="Job Position"
                >
                  {jobPositionData?.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item?.title}
                    </MenuItem>
                  ))}
                </Select>
                {errors.jobPosition && <FormHelperText>{errors.jobPosition}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role-select"
                  value={formData.role}
                  onChange={handleInputChange('role')}
                  label="Role"
                >
                  {roleData?.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="first-name"
                label="First Name"
                variant="outlined"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="last-name"
                label="Last Name"
                variant="outlined"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="username"
                label="Username"
                variant="outlined"
                value={formData.username}
                onChange={handleInputChange('username')}
                error={!!errors.username}
                helperText={errors.username}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="email"
                type="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider/>

        <Box sx={{p: 2, display: 'flex', justifyContent: 'flex-end'}}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{width: isMobile ? '100%' : 'auto'}}>
            <Button
              variant="outlined"
              startIcon={<CloseIcon/>}
              onClick={() => setCreateModal(false)}
              fullWidth={isMobile}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon/>}
              onClick={saveData}
              disabled={isLoading}
              fullWidth={isMobile}
            >
              Save User
            </Button>
          </Stack>
        </Box>
      </Card>
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{width: '100%'}}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateUser;
