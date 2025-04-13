import axios from "axios"

const api = process.env.REACT_APP_ENV_API

export const loginAPI = async (username, password) => {
  try {
    const formData = new FormData();
    formData.append("user", username);
    formData.append("password", password);
    return await axios.post(`${api}/api/v1/auth/login`, formData);
  } catch (error) {
    return error;
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
    const jsonData = {
      hash: hash,
      password: password,
      date_of_birth: dateOfBirth,
      phone: phone,
    };

    if (holiday) {
      jsonData.personal_holiday = dateOfHoliday;
      jsonData.holiday_description = holidayDescription;
    }


    return await axios.put(`${api}/api/v1/auth/validate-user`, jsonData);
  } catch (error) {
    return error;
  }
}
