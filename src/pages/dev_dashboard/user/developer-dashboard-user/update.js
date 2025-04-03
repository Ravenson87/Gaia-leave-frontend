import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import {updateUser} from '../../../../api/user';
import {getJobPosition} from '../../../../api/jobPosition';
import {getRole} from '../../../../api/role';

const UpdateUser = ({setUpdateModal, get, editData}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({
    firstName: editData.first_name || '',
    lastName: editData.last_name || '',
    email: editData.email || '',
    username: editData.username || '',
    jobPosition: null,
    role: null,
    status: editData.status === 1
  });

  const [roleData, setRoleData] = useState([]);
  const [jobPositionData, setJobPositionData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        const jobPosition = jobPositions.data.find((job) => job.id === editData.job_position_id);
        setFormData(prev => ({...prev, jobPosition}));
      }

      if (roles.status === 200) {
        setRoleData(roles.data);
        const role = roles.data.find((role) => role.id === editData.role_id);
        setFormData(prev => ({...prev, role}));
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

  const handleStatusChange = (event) => {
    setFormData({
      ...formData,
      status: event.target.checked
    });
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

  const saveData = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("first_name", formData.firstName);
      formDataObj.append("last_name", formData.lastName);
      formDataObj.append("email", formData.email);
      formDataObj.append("username", formData.username);
      formDataObj.append("role_id", formData.role.id);
      formDataObj.append("job_position_id", formData.jobPosition.id);
      formDataObj.append("status", formData.status ? 1 : 0);

      const response = await updateUser(editData.id, formDataObj);

      if (response.status === 201) {
        get();
        setUpdateModal(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            <EditIcon color="primary"/>
            <Typography variant="h6">Edit User</Typography>
          </Stack>
        }
        action={
          <IconButton
            onClick={() => setUpdateModal(false)}
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

          <Grid item xs={6}>
            <Card variant="outlined" sx={{bgcolor: theme.palette.grey[50]}}>
              <CardContent>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status}
                      onChange={handleStatusChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1">
                      {formData.status ? "Account Active" : "Account Inactive"}
                    </Typography>
                  }
                />
                <Typography variant="caption" color="text.secondary" sx={{display: 'block', mt: 1}}>
                  {formData.status
                    ? "User can log in and access the system"
                    : "User cannot log in or access the system"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>

      <Divider/>

      <Box sx={{p: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{width: isMobile ? '100%' : 'auto'}}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon/>}
            onClick={() => setUpdateModal(false)}
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
            color={formData.status ? "primary" : "warning"}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default UpdateUser;
