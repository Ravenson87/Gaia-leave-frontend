import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton
} from "@mui/material";
import {useState} from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from "@mui/icons-material/Person";
import {validateLoginForm} from "../../helper/validation/Validation";
import {tokenData} from "../../helper/functions/cookies";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setUser} from "../../state/slices/user/userSlice";


const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState({
    username: '',
    password: ''
  });

  function handleChange(event, name) {
    setFormData(prevState => ({
      ...prevState,
      [name]: event
    }));
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

  async function login() {
    const validate = validateLoginForm(formData);
    setError(validate)
    if (!validate) {
      return;
    }
    const check = await tokenData(formData.username, formData.password, dispatch);
    console.log(check, "check")
    if (check) {
      dispatch(setUser())
      navigate('/profile')
    }
  }

  return (
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
            Login
          </Typography>
          <Box
            component="form"
            sx={{display: 'flex', flexDirection: 'column', gap: 3}}
            noValidate
            autoComplete="off"
          >
            {loginField(
              'Username Or Email',
              formData.username,
              error?.username?.length > 3,
              handleChange,
              "username",
              {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{color: '#667eea'}}/>
                  </InputAdornment>
                ),
              },
              "text",
              error.username,
              handleChangeError
            )}

            {loginField(
              'Password',
              formData.password,
              error?.password?.length > 8,
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
            <Typography
              variant="body2"
              sx={{
                color: '#667eea',
                textAlign: 'right',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                }
              }}
            >
              Forgot password?
            </Typography>
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
            onClick={async () => {
              await login();
            }}
          >
            Sign In
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

function loginField(label, value, error, changeHandler, name, inputProps, type, errorMessage, handleChangeError) {
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
      <div dangerouslySetInnerHTML={{__html: errorMessage}} style={{color: "red"}}/>
    </>
  )
}

export default Login;
