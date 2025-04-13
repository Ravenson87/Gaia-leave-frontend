import axios from "axios"
import Cookies from "universal-cookie";

const api = process.env.REACT_APP_ENV_API
const cookies = new Cookies();
const token = cookies.get('token')


export const getJobPosition = async () => {
  try {
    return await axios.get(`${api}/api/v1/job-position/read`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const createJobPosition = async (json) => {
  try {
    return await axios.post(`${api}/api/v1/job-position/create`, json, {
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
export const deleteJobPosition = async (id) => {
  try {
    return await axios.delete(`${api}/api/v1/job-position/delete`, {
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
 * @param json
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateJobPosition = async (id, json) => {
  try {
    return await axios.put(`${api}/api/v1/job-position/update/${id}`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('error: ', error)
  }
}
