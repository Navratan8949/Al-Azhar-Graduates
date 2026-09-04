import api from "./api";

// Create Download
export const createDownload = async (data) => {
    try {
        const response = await api.post("/downloads", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Downloads
export const getDownloads = async (params) => {
    try {
        const response = await api.get("/downloads", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Download by ID
export const getDownloadById = async (id) => {
    try {
        const response = await api.get(`/downloads/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Download
export const updateDownload = async (id, data) => {
    try {
        const response = await api.put(`/downloads/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Download
export const deleteDownload = async (id) => {
    try {
        const response = await api.delete(`/downloads/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
