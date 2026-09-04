import api from "./api";

// Create Complaint
export const createComplaint = async (data) => {
    try {
        const response = await api.post("/complaints", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Complaints
export const getComplaints = async (params) => {
    try {
        const response = await api.get("/complaints", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Complaint by ID
export const getComplaintById = async (id) => {
    try {
        const response = await api.get(`/complaints/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Complaint
export const updateComplaint = async (id, data) => {
    try {
        const response = await api.put(`/complaints/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Complaint
export const deleteComplaint = async (id) => {
    try {
        const response = await api.delete(`/complaints/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
