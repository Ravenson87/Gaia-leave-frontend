import axios from "axios"
import Cookies from "universal-cookie";

const api = "https://admin-troter.softmetrixgroup.com:8443/gaia_leave";
const cookies = new Cookies();
const token = cookies.get('token')


export const getCalendar = async () => {
  try {
    return await axios.get(`${api}/api/v1/calendar/read`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

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

export const subtractDaysFromFreeDays = async (json) => {
  try {
    return await axios.post(`${api}/api/v1/day-off-management/save`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const workingHoursAssign = async (user_id, working_hours, as_free_days) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("working_hours", working_hours);
    formData.append("as_free_days", as_free_days);
    return await axios.post(`${api}/api/v1/working-hours/update`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const createOvertimeHours = async (json) => {
  try {
    return await axios.post(`${api}/api/v1/overtime-hours/create`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const createUserUsedFreeDays = async (json) => {
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

export const deleteUserUsedFreeDaysByIds = async (ids) => {
  try {
    return await axios.delete(`${api}/api/v1/user-used-free-days/delete-by-ids`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ids: ids
      }
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
export const deleteMenu = async (id) => {
  try {
    return await axios.delete(`${api}/api/v1/menu/delete`, {
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
 * @param type
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const updateCalendarByType = async (id, type) => {
  try {
    return await axios.put(
      `${api}/api/v1/calendar/update-by-type/${id}/${type}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('error: ', error);
  }
};
