import axios from "axios"
import Cookies from "universal-cookie";

const api = process.env.REACT_APP_ENV_API
const cookies = new Cookies();
const token = cookies.get('token')


export const getFreeDayType = async () => {
    try {
        return await axios.get(`${api}/api/v1/free-day-type/read`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const createFreeDayType = async (json) => {
    try {
        return await axios.post(`${api}/api/v1/free-day-type/create`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        return error
    }
};

/**
 *
 * @param id
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteFreeDayType = async (id) => {
    try {
        return await axios.delete(`${api}/api/v1/free-day-type/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                id: id
            }
        });
    } catch (error) {
        return error
    }
}
/**
 * @param id
 * @param json
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateFreeDayType = async (id, json) => {
    try {
        return await axios.put(`${api}/api/v1/free-day-type/update/${id}`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        return error
    }
}
