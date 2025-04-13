import axios from "axios"
import Cookies from "universal-cookie";

const api = process.env.REACT_APP_ENV_API
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
    return await axios.y(`${api}/api/v1/working-hours/update`, formData, {
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
    return error
  }
};

export const updateOvertimeCompensationForOvertimeHours = async (json) => {
  try {
    return await axios.put(`${api}/api/v1/overtime-hours/update-overtime-compensation`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error
  }
};

export const deleteOvertimeHours = async (id) => {
  try {
    return await axios.delete(`${api}/api/v1/overtime-hours/delete`, {
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
};

export const createUserUsedFreeDays = async (json) => {
  try {
    return await axios.post(`${api}/api/v1/user-used-free-days/create`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error
  }
};

export const deleteUserUsedFreeDaysByIds = async (ids) => {
  try {
    return await axios.delete(`${api}/api/v1/user-used-free-days/delete-by-ids`, {
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
export const deleteUserUsedFreeDaysById = async (id) => {
  try {
    return await axios.delete(`${api}/api/v1/user-used-free-days/delete`, {
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

export const freeDaysRequest = async (user_id, json) => {
  try {
    return await axios.post(`${api}/api/v1/free-days-booking/request/${user_id}`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error;
  }
};

export const freeDaysAcceptance = async (json) => {
  try {
    return await axios.post(`${api}/api/v1/free-days-booking/acceptance`, json, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const readByDateAndStatus = async (start_date, end_date, status) => {
  try {
    return await axios.get(`${api}/api/v1/free-days-booking/read-by-date-range-and-status?start_date=${start_date}&end_date=${end_date}&status=${status}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const freeDaysBookingRead = async () => {
  try {
    return await axios.get(`${api}/api/v1/free-days-booking/read`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
  }
};

export const freeDaysBookingReadByUserId = async (user_id) => {
  try {
    return await axios.get(`${api}/api/v1/free-days-booking/read-by-user-id?user_id=${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error
  }
};
