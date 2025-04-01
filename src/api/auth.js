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

export const validateUser = async (hash, password, dateOfBirth, phone, dateOfHoliday, holidayDescription, holiday) => {
  try {
    const formData = new FormData();
    formData.append("hash", hash);
    formData.append("password", password);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("phone", phone);

    if (holiday) {
      formData.append("date_of_holiday", dateOfHoliday);
      formData.append("holiday_description", holidayDescription);
    }

    return await axios.put(`${api}/api/v1/auth/validate-user`, formData);
  } catch (error) {
    return error;
  }
}
