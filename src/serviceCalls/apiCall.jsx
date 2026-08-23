import api from "./api";

const API_OAUTH_URL =
  process.env.REACT_APP_OAUTH_URL || "http://localhost:8080/";


/**
 * @param {{ email: string, password: string, rememberMe: boolean }} payload
 */
export const loginUser = ({ email, password, rememberMe }) =>
  api.post("auth/login", { email, password, rememberMe });

export const getGoogleOAuthRedirectUrl = () =>
  `${API_OAUTH_URL}oauth2/authorization/google`;


//--------------------------------REGISTER PAGE--------------------------------------------
/**
 * POST /auth/register
 * @param {object} payload - full signup payload (personal + company + password)
 */
export const registerUser = (payload) => api.post("auth/register", payload);

/* ---------------- Vehicle: types & entry ---------------- */

export const getVehicleTypes = () =>
  api.get(`vehicle/getVehicleType`, {
    withCredentials: true,
  });

export const createVehicleEntry = (payload) =>
  api.post(`vehicle/entry`, payload, {
    withCredentials: true,
  });


export const exitVehicle = (tokenIdOrVehicleNo) =>
  api.post(`vehicle/exit`, null, {
    params: { tokenIdOrVehicleNo },
    withCredentials: true,
  });

export const getVehicleList = (params) =>
  api.get(`vehicle/recentList`, {
    params,
    withCredentials: true,
  });

/**
 * Single vehicle detail
 * GET vehicle/get?tokenIdOrVehicleNo=...
 */
export const getVehicle = (tokenIdOrVehicleNo) =>
  api.get(`vehicle/get`, {
    params: { tokenIdOrVehicleNo },
    withCredentials: true,
    headers: { Accept: "application/json" },
  });

/**
 * PUT /api/v1/vehicle/update/{vehicleId}
 * @param {number|string} vehicleId - path variable
 * @param {object} payload - VehicleUpdateDto body
 */
export const updateVehicle = (vehicleId, payload) =>
  api.put(`vehicle/update/${vehicleId}`, payload, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

/**
 * Delete vehicle
 * DELETE vehicle/delete?tokenIdOrVehicleNo=...
 * (swap the path when your real delete endpoint is ready)
 */
export const deleteVehicle = (vehicleId) =>
  api.delete(`vehicle/delete/${vehicleId}`, {
    withCredentials: true,
  });
/**
 * Export current filter set as PDF (blob)
 * GET vehicle/export/pdf?...
 */
export const exportVehiclesPdf = (params) =>
  api.get(`vehicle/export/pdf`, {
    params,
    withCredentials: true,
    responseType: "blob",
  });

/**
 * Export current filter set as Excel (blob)
 * GET vehicle/export/excel?...
 */
export const exportVehiclesExcel = (params) =>
  api.get(`vehicle/export/excel`, {
    params,
    withCredentials: true,
    responseType: "blob",
  });

export const getUserProfile = () => api.get("user/user");

export const updateUserProfile = (payload) => api.put("user/update", payload,{withCredentials: true});

export const getCompanyDetails = (params) =>
  api.get(`company/get`, {
    params,
    withCredentials: true,
  });

export const updateCompanyDetails = (data) =>
  api.put(`company/update`, data, {
    withCredentials: true,
  });

export const exportCompanyJson = (params) =>
  api.get(`vehicle/backup/export/json`, {
    params,
    withCredentials: true,
    responseType: "blob",
  });

export const exportCompanyCsv = (params) =>
  api.get(`vehicle/backup/export/csv`, {
    params,
    withCredentials: true,
    responseType: "blob",
  });

export const exportCompanyExcel = (params) =>
  api.get(`vehicle/backup/export/csv`, {
    params,
    withCredentials: true,
    responseType: "blob",
  });

// export const importCompanyData = (formData) =>
//   api.post(`vehicle/backup/import/json`, formData, {
//     withCredentials: true,
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
export const importCompanyDataJson = (formData) =>
  api.post(`vehicle/backup/import/json`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const importCompanyDataCsv = (formData) =>
  api.post(`vehicle/backup/import/csv`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getReportSchedule = () =>
  api.get("report/schedule"); // or whatever path your baseURL expects

export const saveReportSchedule = (payload) =>
  api.post("report/schedule", payload);

export const uploadProfilePicture = (payload) =>
  api.post("user/profile-picture", payload);

export const uploadCompanyLogo = (payload) => api.post("company/logo", payload);

export const getCompanyAttachments = (params) =>
  api.get("/company/attachments/all", { params });

export const getReportScheduleById = (id) =>
  api.get(`report/schedule/${id}`, { withCredentials: true });

export const updateReportSchedule = (id, payload) =>
  api.put(`report/schedule/${id}`, payload, { withCredentials: true });

export const deleteReportSchedule = (id) =>
  api.delete(`report/schedule/${id}`, { withCredentials: true });

export const toggleReportScheduleEnabled = (id, enabled) =>
  api.put(`report/schedule/${id}/enabled`, null, {
    params: { enabled },
    withCredentials: true,
  });

  export const getDashboardSummary = () =>
  api.get(`vehicle/dashboard/summary`, {
    withCredentials: true,
  });
  export const getDashboardTrend = () =>
  api.get(`vehicle/dashboard/trend`, {
    withCredentials: true,
  });
 
 export const getDailyReport = (date) =>
  api.get("report/daily", { params: date ?{ date }:{} });

export const getRangeReport = (from, to, includeDetails) =>
  api.get("report/range", { params: { from, to, includeDetails } });

export const deleteCompanyAttachment = (id) =>
  api.delete(`/company/attachments/${id}`);

export const uploadCompanyAttachment = (formData, params) =>
  api.post(`/company/attachments/upload`, formData, {
    params, 
    headers: { "Content-Type": "multipart/form-data" },
  });
  