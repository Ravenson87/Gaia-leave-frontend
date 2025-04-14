import {loginAPI, refreshToken} from "../../api/auth";
import {jwtDecode} from "jwt-decode";
import Cookies from "universal-cookie";
import {Navigate} from "react-router-dom";
import {loginUser, setUser} from "../../state/slices/user/userSlice";
import {getUserById} from "../../api/user";

let tokenDate = new Date();
const cookies = new Cookies();

export async function tokenData(user, password, dispatch, setPasswordFeedback) {
  const response = await loginAPI(user, password);
  if (response.status === 200) {
    setPasswordFeedback({
      type: '',
      message: ''
    })
    const tokenData = response.data;
    const jwtDecodeToken = jwtDecode(tokenData.token);
    tokenDate.setTime(jwtDecodeToken.exp * 1000);

    cookies.set("token", tokenData.token, {path: '/', domain: window.location.hostname, expires: tokenDate});
    cookies.set('refresh_token', tokenData.refreshToken, {
      path: '/',
      domain: window.location.hostname,
      expires: tokenDate
    });

    const expTime = jwtDecodeToken.exp;
    const refreshTokenParam = tokenData.refresh_token;
    setTimer(expTime, refreshTokenParam);
    dispatch(loginUser(jwtDecodeToken));

    if (jwtDecodeToken?.id !== 1) {
      const userData = await getUserById(jwtDecodeToken?.id)
      if (userData?.status !== 400) {
        dispatch(setUser(userData.data));
        return true;
      } else {
        return false
      }
    }
    return true
  } else {
    console.log("response", response)
    setPasswordFeedback({type: 'danger', message: response?.response?.data?.message || 'Failed to login.'} );
    cookies.remove("token");
    cookies.remove("refresh_token");
    await redirectToLogin();
    return false;
  }
}

const redirectToLogin = async () => {
  return <Navigate to={'/login'}/>
}

async function getToken() {
  const cookies = new Cookies();
  const token = cookies.get('token');
  if (!token) {
    await redirectToLogin();
    return null;
  }

  return token;
}

async function setTimer(expTime, refreshToken) {
  const token = await getToken();
  if (!token) return;
  const decodedToken = jwtDecode(token);
  const now = new Date();
  const exp = new Date(decodedToken.exp * 1000);
  const diff = exp.getTime() - now.getTime();

  setTimeout(async () => {
    await getRefreshToken(refreshToken);
  }, diff - 5);
}

async function getRefreshToken(refreshTokenParam) {

  const response = await refreshToken(refreshTokenParam);
  if (response?.status === 200) {
    const data = response.data;
    const decodedToken = jwtDecode(data.token);
    tokenDate.setTime(decodedToken.exp * 1000);
    cookies.set("token", data.token, {path: '/', domain: window.location.hostname, expires: tokenDate});
    cookies.set('refresh_token', data.refresh_token, {
      path: '/',
      domain: window.location.hostname,
      expires: tokenDate
    });

    const expTime = decodedToken.exp;
    setTimer(expTime, refreshToken);
  }
}

export async function logoutUser() {
  cookies.remove("token");
  cookies.remove("refreshToken");
  await redirectToLogin();
  return false;
}
