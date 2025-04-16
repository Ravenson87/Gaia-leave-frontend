import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton, Snackbar,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import {updateRole} from '../../../../api/role';
import {updateFreeDayType} from "../../../../api/freeDayType";

const UpdateFreeDayType = ({setUpdateModal, get, editData}) => {
  const [formData, setFormData] = useState({
    id: '',
    type: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        type: editData.type || '',
        description: editData.description || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = 'Free day type name is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const showToast = (message, severity) => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({...toast, open: false});
  };

  const handleSubmit = async () => {

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await updateFreeDayType(formData.id, formData);
      if (response.status === 200) {
        showToast("Free Day Type successfully created!", "success");
        get();
        setUpdateModal(false);
      } else {
        showToast(response?.response?.data?.message, "error");
      }
    } catch (error) {
      setErrors({name: 'Failed to update role'});
      showToast('Failed to update free Day Type ', "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card elevation={3} sx={{borderRadius: 2}}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <EditIcon color="primary"/>
              <Typography variant="h6">Edit Free Day Type</Typography>
            </Stack>
          }
          action={
            <IconButton onClick={() => setUpdateModal(false)} size="small">
              <CloseIcon/>
            </IconButton>
          }
        />
        <Divider/>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                label="Role ID"
                value={formData.id}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="type"
                label="Role Name"
                value={formData.type}
                onChange={handleChange}
                error={!!errors.type}
                helperText={errors.type}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider/>
        <Box sx={{p: 2, display: 'flex', justifyContent: 'flex-end'}}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setUpdateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon/>}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Save Changes
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

export default UpdateFreeDayType;
