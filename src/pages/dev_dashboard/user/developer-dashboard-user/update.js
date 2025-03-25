import * as React from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {createUser, updateUser} from "../../../../api/user";
import {getJobPosition} from "../../../../api/jobPosition";
import {getRole} from "../../../../api/role";

const UpdateUser = ({setUpdateModal, get, editData}) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState(editData.first_name || '');
  const [lastName, setLastName] = useState(editData.last_name || '');
  const [email, setEmail] = useState(editData.email || '');
  const [username, setUsername] = useState(editData.username || '');
  const [showPassword, setShowPassword] = useState(false);
  const [jobPosition, setJobPosition] = useState(null);
  const [role, setRole] = useState(null);
  const [roleData, setRoleData] = useState([]);
  const [jobPositionData, setJobPositionData] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    getJobPosition().then(r => {
      if (r.status === 200) {
        setJobPositionData(r.data)
        const job_position = r.data.find((job) => job.id === editData.job_position_id);
        setJobPosition(job_position);
      }
    });
    getRole().then(r => {
      if (r.status === 200) {
        setRoleData(r.data)
        const role = r.data.find((role) => role.id === editData.role_id);
        setRole(role);
      }
    });
  }

  function saveData() {
    if (0 === firstName?.length) {
      setError(true);
      return;
    }

    const jsonData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      role_id: role.id,
      job_position_id: jobPosition.id,
      status: 1,
    }

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("role_id", role.id);
    formData.append("job_position_id", jobPosition.id);
    formData.append("status", 1);


    updateUser(editData.id, formData).then((response) => {
      if (response.status === 201) {
        get();
        setUpdateModal(false);
      }
    })
  }

  const handleChange = (event) => {
    setJobPosition(event.target.value);
  };

  const handleChangeRole = (event) => {
    setRole(event.target.value);
  };

  const getStyles = (name, theme) => {
    return {
      display: 'block',
      width: '100%',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    };
  };

  return (
    <div className="w-100 col-md-12 row">
      <div className="col-md-12 d-flex justify-content-end">
        <Button variant="outlined"
                className="my-3"
                startIcon={<CloseIcon/>}
                onClick={() => setUpdateModal(false)}
        >Close</Button>
      </div>
      <div className="col-md-3">
        <FormControl className="w-100 mb-2">
          <InputLabel id="demo-simple-select-autowidth-label">Job position</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={jobPosition}
            onChange={handleChange}
            label="Job position"
            className="w-100"
          >
            {jobPositionData?.map((item, index) => (
              <MenuItem value={item}
                        className="w-100"
                        style={getStyles(name, theme)}
              >
                <em>{item?.title}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-md-3">
        <FormControl className="w-100 mb-2">
          <InputLabel id="demo-simple-select-autowidth-label" className="w-100">Role</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={role}
            onChange={handleChangeRole}
            label="Age"
            className="w-100"
          >
            {roleData?.map((item, index) => (
              <MenuItem value={item}
                        className="w-100"
                        style={getStyles(name, theme)}
              >
                <em>{item?.name}</em>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="col-md-3">
        <TextField className="w-100" id="outlined-basic" label="First name" variant="outlined"
                   error={error}
                   value={firstName}
                   onChange={(e) => {
                     setFirstName(e.target.value);
                     setError(false);
                   }}/>
        {error && (<p style={{color: 'red'}}>This field is required.</p>)}
      </div>
      <div className="col-md-3">
        <TextField className="w-100"
                   id="outlined-basic"
                   label="Last name"
                   variant="outlined"
                   value={lastName}
                   onChange={(e) => {
                     setLastName(e.target.value);
                   }}/>
      </div>
      <div className="col-md-3">
        <TextField className="w-100"
                   type="text"
                   id="outlined-basic"
                   label="Username"
                   variant="outlined"
                   value={username}
                   onChange={(e) => {
                     setUsername(e.target.value);
                   }}/>
      </div>
      <div className="col-md-3">
        <TextField className="w-100"
                   type="email"
                   id="outlined-basic"
                   label="Email"
                   variant="outlined"
                   value={email}
                   onChange={(e) => {
                     setEmail(e.target.value);
                   }}/>
      </div>
      <div className="col-md-12 d-flex justify-content-end">
        <Button variant="contained"
                className="my-3"
                startIcon={<SaveIcon/>}
                onClick={() => saveData()}>
          Save
        </Button>
      </div>
    </div>
  );
}
export default UpdateUser;
