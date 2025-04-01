import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormHelperText
} from "@mui/material";
import {useEffect, useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import {validateUser} from "../../api/auth";
import {checkUserForVerification} from "../../api/user";
import ExpiredValidationCodePage from "./ExpiredValidationCode";
import {useNavigate} from "react-router-dom";

const RegistrationForm = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    repeatPassword: '',
    dateOfBirth: null,
    telephone: '',
    religiousHoliday: '',
    religiousHolidayDate: '',
    includeReligiousHoliday: false
  });

  const [error, setError] = useState({
    password: '',
    repeatPassword: '',
    dateOfBirth: '',
    telephone: '',
    religiousHoliday: ''
  });

  useEffect(() => {
    get();
  }, []);

  function getQueryParam(query) {
    const hash = window.location.hash;
    const params = hash.includes("?") ? hash.split("?")[1] : null;
    return params ? new URLSearchParams(params).get(query) : null;
  }

  function get() {
    const params = getQueryParam("h");
    if (params) {
      checkUserForVerification(params).then((res) => {
        if (res.status === 200) {
          console.log("res.data", res.data)
          setShow(!res.data);
        } else {
          setShow(false);
        }
      })
    }
  }

  function handleChange(event, name) {
    if (name === 'dateOfBirth') {
      setFormData(prevState => ({
        ...prevState,
        [name]: event
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: event
      }));
    }
  }

  function handleChangeError(name) {
    setError(prevState => ({
      ...prevState,
      [name]: ''
    }));
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowRepeatPassword() {
    setShowRepeatPassword(!showRepeatPassword);
  }

  function toggleReligiousHoliday() {
    setFormData(prevState => ({
      ...prevState,
      includeReligiousHoliday: !prevState.includeReligiousHoliday
    }));
  }

  function validateForm() {
    let isValid = true;
    let newErrors = {
      password: '',
      repeatPassword: '',
      dateOfBirth: '',
      telephone: '',
      religiousHoliday: ''
    };

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }

    if (!formData.telephone) {
      newErrors.telephone = 'Telephone number is required';
      isValid = false;
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.telephone)) {
      newErrors.telephone = 'Telephone number is invalid';
      isValid = false;
    }

    if (formData.includeReligiousHoliday && !formData.religiousHoliday) {
      newErrors.religiousHoliday = 'Religious Holiday is required.';
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  }

  function handleSubmit() {
    if (validateForm()) {
      validateUser(
        getQueryParam("h"),
        formData.password,
        formData.dateOfBirth,
        formData.telephone,
        formData.religiousHolidayDate,
        formData.religiousHoliday,
        formData.includeReligiousHoliday).then((res) => {
        if (res.status === 200) {
          navigate('/login');
        }
      });
    }
  }

  const useStyles = {
    phoneInputContainer: {
      '& .special-label': {
        color: '#666666',
        fontSize: '14px',
        transform: 'translateY(-14px)',
        background: 'white',
        padding: '0 5px',
      },
      '& .form-control': {
        width: '100%',
        height: '56px',
        borderColor: '#e0e0e0',
        borderRadius: '4px',
        paddingLeft: '48px !important',
        '&:hover': {
          borderColor: '#667eea',
        },
        '&:focus': {
          borderColor: '#667eea',
          boxShadow: 'none',
          outline: 'none',
        },
      },
      '& .flag-dropdown': {
        borderRight: 'none',
        background: 'transparent',
        borderColor: '#e0e0e0',
        '&:hover': {
          borderColor: '#667eea',
        },
        '&.open': {
          background: 'transparent',
          borderColor: '#667eea',
        },
      },
      '& .selected-flag': {
        paddingLeft: '48px',
      },
    },
    phoneIconContainer: {
      position: 'absolute',
      left: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      pointerEvents: 'none',
    }
  };

  return (
    <>
      {show ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 2
          }}
        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 450,
              p: 4,
              borderRadius: 4,
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              backgroundColor: "white",
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
              }
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{color: '#333', textAlign: 'center', mb: 3, fontWeight: 'bold'}}>
                Registration
              </Typography>
              <Box
                component="form"
                sx={{display: 'flex', flexDirection: 'column', gap: 3}}
                noValidate
                autoComplete="off"
              >

                {formField(
                  'Password',
                  formData.password,
                  Boolean(error.password),
                  handleChange,
                  "password",
                  {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{color: '#667eea'}}/>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                  showPassword ? "text" : "password",
                  error.password,
                  handleChangeError
                )}


                {formField(
                  'Repeat Password',
                  formData.repeatPassword,
                  Boolean(error.repeatPassword),
                  handleChange,
                  "repeatPassword",
                  {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{color: '#667eea'}}/>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowRepeatPassword}
                          edge="end"
                        >
                          {showRepeatPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                  showRepeatPassword ? "text" : "password",
                  error.repeatPassword,
                  handleChangeError
                )}
                <TextField
                  fullWidth
                  label="Date of birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    handleChange(e.target.value, "dateOfBirth");
                    handleChangeError("dateOfBirth");
                  }}
                  error={Boolean(error.dateOfBirth)}
                  helperText={error.dateOfBirth}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CakeIcon sx={{color: '#667eea'}}/>
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />

                <Box position="relative" sx={useStyles}>
                  <PhoneInput
                    country={'rs'}
                    value={formData.telephone}
                    onChange={(phone) => {
                      handleChange(phone, "telephone");
                      if (handleChangeError) handleChangeError("telephone");
                    }}
                    inputProps={{
                      name: 'telephone',
                      required: false,
                    }}
                    specialLabel="Telephone"
                    enableSearch={true}
                    disableSearchIcon={true}
                    searchPlaceholder="Search country"
                    containerStyle={{width: '100%'}}
                    dropdownStyle={{
                      width: '300px',
                      borderColor: '#e0e0e0',
                      borderRadius: '4px',
                    }}
                  />
                  {error.telephone && (
                    <Box sx={{color: '#f44336', mt: 0.5, ml: 1.5, fontSize: '0.75rem'}}>
                      {error.telephone}
                    </Box>
                  )}
                </Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.includeReligiousHoliday}
                      onChange={toggleReligiousHoliday}
                      sx={{
                        color: '#667eea',
                        '&.Mui-checked': {
                          color: '#667eea',
                        },
                      }}
                    />
                  }
                  label="I want to add a religious holiday"
                />
                {formData.includeReligiousHoliday && (
                  <TextField
                    fullWidth
                    label="Date of holiday"
                    type="date"
                    value={formData.religiousHolidayDate}
                    onChange={(e) => {
                      handleChange(e.target.value, "religiousHolidayDate");
                      handleChangeError("religiousHolidayDate");
                    }}
                    error={Boolean(error.religiousHolidayDate)}
                    helperText={error.religiousHolidayDate}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CakeIcon sx={{color: '#667eea'}}/>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#667eea',
                      },
                    }}
                  />
                )}
                {formData.includeReligiousHoliday && (
                  formField(
                    'Religious Holiday',
                    formData.religiousHoliday,
                    Boolean(error.religiousHoliday),
                    handleChange,
                    "religiousHoliday",
                    {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CelebrationIcon sx={{color: '#667eea'}}/>
                        </InputAdornment>
                      ),
                    },
                    "text",
                    error.religiousHoliday,
                    handleChangeError
                  )
                )}
              </Box>
            </CardContent>
            <CardActions sx={{justifyContent: 'center', flexDirection: 'column', gap: 2}}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#667eea',
                  color: 'white',
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  boxShadow: '0 4px 10px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    bgcolor: '#5c71d6',
                    boxShadow: '0 6px 15px rgba(102, 126, 234, 0.6)',
                  }
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </CardActions>
          </Card>
        </Box>
      ) : (
        <ExpiredValidationCodePage/>
      )}
    </>
  );
};

function formField(label, value, error, changeHandler, name, inputProps, type, errorMessage, handleChangeError) {
  return (
    <>
      <TextField
        fullWidth
        label={label}
        variant="outlined"
        value={value}
        error={error}
        type={type}
        onChange={(e) => {
          changeHandler(e.target.value, name);
          handleChangeError(name);
        }}
        InputProps={inputProps}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#667eea',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#667eea',
          },
        }}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </>
  )
}

export default RegistrationForm;
