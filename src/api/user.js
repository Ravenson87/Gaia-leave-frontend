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
 * @param json
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateUser = async (id, json) => {
    try {
        return await axios.put(`${api}/api/v1/user/update/${id}`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('error: ', error)
    }
}
