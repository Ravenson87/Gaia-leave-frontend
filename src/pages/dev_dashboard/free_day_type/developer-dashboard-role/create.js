import React, {useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Alert,
  Snackbar
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import {createFreeDayType} from "../../../../api/freeDayType";

const CreateFreeDayType = ({setCreateModal, get}) => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
    if (errors[name]) {
      setErrors({...errors, [name]: ""});
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Type is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await createFreeDayType(formData);
      if (response.status === 201) {
        showToast("Free day type successfully created!", "success");
        get();
        setCreateModal(false);
      } else {
        showToast(response?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      setErrors({name: "Failed to create role"});
      showToast(error.response?.data?.message || "Failed to create free day type. Please try again.", "error");
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
              <AddIcon color="primary"/>
              <Typography variant="h6">Create Free Day Type</Typography>
            </Stack>
          }
          action={
            <IconButton onClick={() => setCreateModal(false)} size="small">
              <CloseIcon/>
            </IconButton>
          }
        />
        <Divider/>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="type"
                label="Free Day Type Name"
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
        <Box sx={{p: 2, display: "flex", justifyContent: "flex-end"}}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon/>}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Create Free Day Type
            </Button>
          </Stack>
        </Box>
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateFreeDayType;
