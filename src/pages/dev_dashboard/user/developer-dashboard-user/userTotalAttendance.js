import * as React from 'react';
import {useState} from 'react';
import {Box, Button, Grid, IconButton, Paper, TextField, Typography, useTheme} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {createUserTotalAttendance, updateUserTotalAttendance} from "../../../../api/user";

const SetWorkingParameters = ({setModalOpen, get, data}) => {
  const theme = useTheme();
  const [totalFreeDays, setTotalFreeDays] = useState(data?.userTotalAttendance?.total_free_days || 0);
  const [totalWorkingHours, setTotalWorkingHours] = useState(data?.userTotalAttendance?.total_working_hours || 0);
  const [originalFreeDays, setOriginalFreeDays] = useState(0);
  const [originalWorkingHours, setOriginalWorkingHours] = useState(0);
  const [error, setError] = useState(false);

  const incrementFreeDays = () => {
    setTotalFreeDays(prev => prev + 1);
  };

  const decrementFreeDays = () => {
    if (totalFreeDays > 0) {
      setTotalFreeDays(prev => prev - 1);
    }
  };

  const incrementWorkingHours = () => {
    setTotalWorkingHours(prev => prev + 1);
  };

  const decrementWorkingHours = () => {
    if (totalWorkingHours > 0) {
      setTotalWorkingHours(prev => prev - 1);
    }
  };

  const handleFreeDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalFreeDays(value);
    } else if (e.target.value === "") {
      setTotalFreeDays("");
    }
  };

  const handleWorkingHoursChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setTotalWorkingHours(value);
    } else if (e.target.value === "") {
      setTotalWorkingHours("");
    }
  };

  const saveData = async () => {

    if (totalFreeDays === "" || totalWorkingHours === "") {
      setError(true);
      return;
    }

    const jsonData = {
      user_id: data?.id,
      total_free_days: totalFreeDays,
      total_working_hours: totalWorkingHours
    };

    try {
      const response = !data?.userTotalAttendance?.total_free_days ? await createUserTotalAttendance(jsonData) : await updateUserTotalAttendance(jsonData, data?.userTotalAttendance?.id);
      if (response.status === 201) {
        get();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setError(true);
    }
  };

  const hasChanges = originalFreeDays !== totalFreeDays || originalWorkingHours !== totalWorkingHours;

  return (
    <Paper elevation={3} className="p-4">
      <Grid container spacing={3}>
        <Grid item xs={12} className="d-flex justify-content-between align-items-center">
          <Typography variant="h6">Setting working parameters</Typography>
          <Button
            variant="outlined"
            startIcon={<CloseIcon/>}
            onClick={() => setModalOpen(false)}
          >
            Close
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="p-3" border={1} borderColor="divider" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom>
              Total free days
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <IconButton
                onClick={decrementFreeDays}
                color="primary"
                disabled={totalFreeDays <= 0}
              >
                <RemoveIcon/>
              </IconButton>
              <TextField
                value={totalFreeDays}
                onChange={handleFreeDaysChange}
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {min: 0}
                }}
                error={error && totalFreeDays === ""}
                className="mx-2"
                style={{width: '100px'}}
              />
              <IconButton onClick={incrementFreeDays} color="primary">
                <AddIcon/>
              </IconButton>
              <Typography variant="body1" className="ml-2">days</Typography>
            </Box>
            {error && totalFreeDays === "" && (
              <Typography color="error" variant="caption">
                This field is required.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="p-3" border={1} borderColor="divider" borderRadius={1}>
            <Typography variant="subtitle1" gutterBottom>
              Total working hours
            </Typography>
            <Box display="flex" alignItems="center" mt={2}>
              <IconButton
                onClick={decrementWorkingHours}
                color="primary"
                disabled={totalWorkingHours <= 0}
              >
                <RemoveIcon/>
              </IconButton>
              <TextField
                value={totalWorkingHours}
                onChange={handleWorkingHoursChange}
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {min: 0}
                }}
                error={error && totalWorkingHours === ""}
                className="mx-2"
                style={{width: '100px'}}
              />
              <IconButton onClick={incrementWorkingHours} color="primary">
                <AddIcon/>
              </IconButton>
              <Typography variant="body1" className="ml-2">hours</Typography>
            </Box>
            {error && totalWorkingHours === "" && (
              <Typography color="error" variant="caption">
                This field is required.
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} className="d-flex justify-content-end">
          <Button
            variant="contained"
            startIcon={<SaveIcon/>}
            onClick={saveData}
            disabled={!hasChanges}
            color="primary"
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SetWorkingParameters;
