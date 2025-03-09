import axios from "axios"

const api = "https://admin-troter.softmetrixgroup.com:8443/gaia_leave";

export const loginAPI = async (username, password) => {
    try {
        const formData = new FormData();
        formData.append("user", username);
        formData.append("password", password);
        return await axios.post(`${api}/api/v1/auth/login`, formData);
    } catch (error) {
        console.log(error)
    }
};

export const refreshToken = async (refreshTokenParam) => {
    try {
        const formData = new FormData();
        formData.append("refresh_token", refreshTokenParam);
        return await axios.post(`${api}/api/v1/auth/refresh_token`, formData);
    } catch (error) {
        console.log(error)
    }
}