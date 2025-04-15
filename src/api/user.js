import { axiosWithToken } from "./axios";

/**
 * User Authentication & Account Management
 * --------------------------------------
 * Functions related to user authentication, creation, and basic account operations
 */

/**
 * Retrieves the currently authenticated user's information
 * @returns {Promise} Promise object representing the user data or error
 */
export const getUser = async () => {
  try {
    return await axiosWithToken().get(`/api/v1/user/read`);
  } catch (error) {
    return error;
  }
};

/**
 * Retrieves a user by their ID
 * @param {string} id - The user ID
 * @returns {Promise} Promise object representing the user data or error
 */
export const getUserById = async (id) => {
  try {
    return await axiosWithToken().get(`/api/v1/user/read-by-id?id=${id}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Verifies a user using a hash
 * @param {string} hash - The verification hash
 * @returns {Promise} Promise object representing the verification result
 */
export const checkUserForVerification = async (hash) => {
  try {
    return await axiosWithToken().get(`/api/v1/user/read-by-hash?hash=${hash}`);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Creates a new user
 * @param {Object} json - User data in JSON format
 * @returns {Promise} Promise object representing the created user or error
 */
export const createUser = async (json) => {
  try {
    return await axiosWithToken().post(`/api/v1/user/create`, json);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Updates user information
 * @param {FormData} formData - Form data containing user information to update
 * @returns {Promise} Promise object representing the updated user or error
 */
export const updateUser = async (formData) => {
  try {
    return await axiosWithToken().put(`/api/v1/user/update`, formData);
  } catch (error) {
    console.error("error: ", error);
  }
};

/**
 * Updates a user's password
 * @param {string} id - User ID
 * @param {string} old_password - Current password
 * @param {string} new_password - New password
 * @returns {Promise} Promise object representing the result or error
 */
export const updateUserPassword = async (id, old_password, new_password) => {
  try {
    const formData = new FormData();
    formData.append("old_password", old_password);
    formData.append("new_password", new_password);
    return await axiosWithToken().put(`/api/v1/user/update-password/${id}`, formData);
  } catch (error) {
    return error;
  }
};

/**
 * Updates a user's status
 * @param {string} id - User ID
 * @param {string} status - New status
 * @returns {Promise} Promise object representing the result or error
 */
export const updateUserStatus = async (id, status) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("status", status);
    return await axiosWithToken().put(`/api/v1/user/update-status/${id}`, formData);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deletes a user account
 * @param {string} id - User ID to delete
 * @returns {Promise} Promise object representing the deletion result
 */
export const deleteUser = async (id) => {
  try {
    return await axiosWithToken().delete(`/api/v1/user/delete`, {
      params: { id }
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

/**
 * Profile & Document Management
 * ---------------------------
 * Functions for managing user profile information and documents
 */

/**
 * Uploads a profile image for a user
 * @param {File} file - The image file to upload
 * @param {string} user_id - User ID
 * @returns {Promise} Promise object representing the upload result
 */
export const updateUploadProfileImage = async (file, user_id) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user_id);
    return await axiosWithToken().put(`/api/v1/user/upload-image`, formData);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Uploads a document for a user
 * @param {string} user_id - User ID
 * @param {File} file - The document file to upload
 * @returns {Promise} Promise object representing the upload result or error
 */
export const documentUpload = async (user_id, file) => {
  try {
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("file", file);
    return await axiosWithToken().post(`/api/v1/user-documents/create`, formData);
  } catch (error) {
    return error;
  }
};

/**
 * Deletes a user document
 * @param {string} id - Document ID to delete
 * @returns {Promise} Promise object representing the deletion result or error
 */
export const documentDelete = async (id) => {
  try {
    return await axiosWithToken().delete(`/api/v1/user-documents/delete?id=${id}`);
  } catch (error) {
    return error;
  }
};

/**
 * Email & Communication
 * -------------------
 * Functions for handling email communications and mail history
 */

/**
 * Sends an email to specified address
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body content
 * @returns {Promise} Promise object representing the send result or error
 */
export const createMailByAddress = async (to, subject, body) => {
  try {
    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);
    return await axiosWithToken().post(`/api/v1/mail/send`, formData);
  } catch (error) {
    return error;
  }
};

/**
 * Retrieves mail history for specified addresses
 * @param {string} addresses - Email addresses to get history for
 * @returns {Promise} Promise object representing the mail history or empty array
 */
export const getMailHistoryByAddress = async (addresses) => {
  try {
    return await axiosWithToken().get(`/api/v1/mail-history/read-by-addresses?addresses=${addresses}`);
  } catch (error) {
    return [];
  }
};

/**
 * Attendance & Working Hours
 * ------------------------
 * Functions for managing user attendance and working hours
 */

/**
 * Records free day usage for a user
 * @param {Object} json - Free day usage data
 * @returns {Promise} Promise object representing the result
 */
export const createUserUsedFreeType = async (json) => {
  try {
    return await axiosWithToken().post(`/api/v1/user-used-free-days/create`, json);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Creates a user attendance record
 * @param {Object} json - Attendance data
 * @returns {Promise} Promise object representing the result or error
 */
export const createUserTotalAttendance = async (json) => {
  try {
    return await axiosWithToken().post(`/api/v1/user-total-attendance/create`, json);
  } catch (error) {
    return error;
  }
};

/**
 * Updates a user attendance record
 * @param {Object} json - Updated attendance data
 * @param {string} id - Attendance record ID
 * @returns {Promise} Promise object representing the update result or error
 */
export const updateUserTotalAttendance = async (json, id) => {
  try {
    return await axiosWithToken().put(`/api/v1/user-total-attendance/update/${id}`, json);
  } catch (error) {
    return error;
  }
};

/**
 * Updates working hours for a user
 * @param {string} userId - User ID
 * @param {number} workingHours - Working hours to set
 * @returns {Promise} Promise object representing the update result
 */
export const updateWorkingHours = async (userId, workingHours) => {
  try {
    const json = { user_id: userId, working_hours: workingHours };
    return await axiosWithToken().put(`/api/v1/working-hours/update`, json);
  } catch (error) {
    console.log(error);
  }
};
