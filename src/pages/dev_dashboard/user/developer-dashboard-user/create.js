import * as React from 'react';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme
} from "@mui/material";
import {useEffect, useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {createUser} from "../../../../api/user";
import {getJobPosition} from "../../../../api/jobPosition";
import {getRole} from "../../../../api/role";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CreateUser = ({setCreateModal, get}) => {
  const theme = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      }
    });
    getRole().then(r => {
      if (r.status === 200) {
        setRoleData(r.data)
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
      password: password,
      role_id: role.id,
      job_position_id: jobPosition.id,
      status: 1,
    }

    createUser(jsonData).then((response) => {
      if (response.status === 201) {
        get();
        setCreateModal(false);
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

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  return (
    <div className="w-100 col-md-12 row">
      <div className="col-md-12 d-flex justify-content-end">
        <Button variant="outlined"
                className="my-3"
                startIcon={<CloseIcon/>}
                onClick={() => setCreateModal(false)}
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
      <div className="col-md-3">
        <TextField
          className="w-100"
          type={showPassword ? 'text' : 'password'}
          id="outlined-basic"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword} edge="end">
                  {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
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
export default CreateUser;
