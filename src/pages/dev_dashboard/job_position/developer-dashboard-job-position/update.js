import React, {useEffect, useState} from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import {updateJobPosition} from "../../../../api/jobPosition";

const UpdateJobPosition = ({ setUpdateModal, get, editData }) => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
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
        title: editData.title || "",
        description: editData.description || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
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
      const response = await updateJobPosition(formData.id, formData);
      if (response.status === 200) {
        showToast("Job position successfully updated!", "success");
        get();
        setUpdateModal(false);
      } else {
        showToast(response.response?.data?.message || "Failed to update job position. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error updating job position:", error);
      setErrors({ title: "Failed to update job position" });
      showToast(error.response?.data?.message || "Failed to update job position. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card elevation={3} sx={{ borderRadius: 2 }}>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} alignItems="center">
              <EditIcon color="primary" />
              <Typography variant="h6">Edit Job Position</Typography>
            </Stack>
          }
          action={
            <IconButton onClick={() => setUpdateModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                label="Position ID"
                value={formData.id}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="title"
                label="Job Title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
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
        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setUpdateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateJobPosition;
