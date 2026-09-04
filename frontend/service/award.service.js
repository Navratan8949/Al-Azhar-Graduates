import api from "./api";

// Create Award
export const createAward = async (data) => {
    try {
        const response = await api.post("/awards", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Awards
export const getAwards = async (params) => {
    try {
        const response = await api.get("/awards", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Award by ID
export const getAwardById = async (id) => {
    try {
        const response = await api.get(`/awards/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Award
export const updateAward = async (id, data) => {
    try {
        const response = await api.put(`/awards/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Award
export const deleteAward = async (id) => {
    try {
        const response = await api.delete(`/awards/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
