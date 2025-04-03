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
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import {createRole} from "../../../../api/role";

const CreateRole = ({ setCreateModal, get }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await createRole(formData);
      if (response.status === 201) {
        get();
        setCreateModal(false);
      }
    } catch (error) {
      console.error("Error creating role:", error);
      setErrors({ name: "Failed to create role" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      <CardHeader
        title={
          <Stack direction="row" spacing={1} alignItems="center">
            <AddIcon color="primary" />
            <Typography variant="h6">Create Role</Typography>
          </Stack>
        }
        action={
          <IconButton onClick={() => setCreateModal(false)} size="small">
            <CloseIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              name="name"
              label="Role Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
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
          <Button variant="outlined" onClick={() => setCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Create Role
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default CreateRole;
