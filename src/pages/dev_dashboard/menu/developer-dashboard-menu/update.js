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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import {updateMenu} from "../../../../api/menu";

const UpdateMenu = ({ setUpdateModal, get, editData }) => {
  const [formData, setFormData] = useState({
    id: "",
    menu_number: null,
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id,
        menu_number: editData.menu_number || "",
        name: editData.name || "",
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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await updateMenu(formData.id, formData);
      if (response.status === 200) {
        get();
        setUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating menu:", error);
      setErrors({ name: "Failed to update menu" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <EditIcon color="primary" />
            <Typography variant="h6">Edit Menu</Typography>
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
  );
};

export default UpdateMenu;
