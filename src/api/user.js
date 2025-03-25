import axios from "axios"
import Cookies from "universal-cookie";

const api = "https://admin-troter.softmetrixgroup.com:8443/gaia_leave";
const cookies = new Cookies();
const token = cookies.get('token')


export const getUser = async () => {
    try {
        return await axios.get(`${api}/api/v1/user/read`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const getUserById = async (id) => {
  try {
    return await axios.get(`${api}/api/v1/user/read-by-id?id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};


export const createUser = async (json) => {
    try {
        return await axios.post(`${api}/api/v1/user/create`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const documentUpload = async (user_id, file) => {
    try {
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("file", file);
        return await axios.post(`${api}/api/v1/user-documents/create`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const createUserUsedFreeType = async (json) => {
    try {
        return await axios.post(`${api}/api/v1/user-used-free-days/create`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const createUserTotalAttendance= async (json) => {
    try {
        return await axios.post(`${api}/api/v1/user-total-attendance/create`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const updateUserTotalAttendance= async (json, id) => {
  try {
    return await axios.put(`${api}/api/v1/user-total-attendance/update/${id}`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const updateWorkingHours = async (userId, workingHours) => {
  try {
    const json = {
      user_id: userId,
      working_hours: workingHours
    }
    return await axios.put(`${api}/api/v1/working-hours/update`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const updateUploadProfileImage = async (file, user_id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user_id);
    return await axios.put(`${api}/api/v1/user/upload-image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const updateUserPassword= async (id, old_password, new_password) => {
  try {
    const json = {
      old_password: old_password,
      new_password: new_password
    }
    return await axios.put(`${api}/update-password/${id}`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

/**
 *
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteUser = async (id) => {
    try {
        return await axios.delete(`${api}/api/v1/user/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: id
            }
        });
    } catch (error) {
        console.error('error: ', error)
    }
}
/**
 * @param id
 * @param formData
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateUser = async (id, formData) => {
    try {
        return await axios.put(`${api}/api/v1/user/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('error: ', error)
    }
}
