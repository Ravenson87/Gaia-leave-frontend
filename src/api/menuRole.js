import axios from "axios"
import Cookies from "universal-cookie";

const api = "https://admin-troter.softmetrixgroup.com:8443/gaia_leave";
const cookies = new Cookies();
const token = cookies.get('token')


export const getMenuRole = async () => {
    try {
        return await axios.get(`${api}/api/v1/menu_role/read`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const getEndpoint = async () => {
  try {
    return await axios.get(`${api}/api/v1/endpoint/read`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const createMenuRole = async (json) => {
    try {
        return await axios.post(`${api}/api/v1/menu_role/create`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log(error)
    }
};

export const createEndpointRole = async (json) => {
    try {
        return await axios.post(`${api}/api/v1/role-endpoint/create`, json, {
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
export const deleteMenuRole = async (id) => {
    try {
        return await axios.delete(`${api}/api/v1/role-menu/delete`, {
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
export const updateMenuRole = async (id, json) => {
    try {
        return await axios.put(`${api}/api/v1/menu_role/update/${id}`, json, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error('error: ', error)
    }
}
