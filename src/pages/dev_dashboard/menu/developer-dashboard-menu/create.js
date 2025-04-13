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
import {createMenu} from "../../../../api/menu";

const CreateMenu = ({ setVisible, get }) => {
  const [formData, setFormData] = useState({
    menu_number: null,
    name: "",
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.menu_number) {
      newErrors.menu_number = "Menu number is required";
      valid = false;
    }
    if (!formData.name.trim()) {
      newErrors.name = "Menu name is required";
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
      const response = await createMenu(formData);
      if (response.status === 201) {
        showToast("Menu successfully created!", "success");
        get();
        setVisible(false);
      } else {
        showToast(response.response?.data?.message || "Failed to create menu. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error creating menu:", error);
      setErrors({ name: "Failed to create menu" });
      showToast(error.response?.data?.message || "Failed to create menu. Please try again.", "error");
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
              <AddIcon color="primary" />
              <Typography variant="h6">Create Menu</Typography>
            </Stack>
          }
          action={
            <IconButton onClick={() => setVisible(false)} size="small">
              <CloseIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="menu_number"
                label="Menu Number"
                type="number"
                value={formData.menu_number}
                onChange={handleChange}
                error={!!errors.menu_number}
                helperText={errors.menu_number}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => setVisible(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              Create Menu
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

export default CreateMenu;
