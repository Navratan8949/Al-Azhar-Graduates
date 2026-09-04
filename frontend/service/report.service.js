import api from "./api";

// Create Report
export const createReport = async (data) => {
    try {
        const response = await api.post("/reports", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Reports
export const getReports = async (params) => {
    try {
        const response = await api.get("/reports", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Report by ID
export const getReportById = async (id) => {
    try {
        const response = await api.get(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Report
export const updateReport = async (id, data) => {
    try {
        const response = await api.put(`/reports/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Report
export const deleteReport = async (id) => {
    try {
        const response = await api.delete(`/reports/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
