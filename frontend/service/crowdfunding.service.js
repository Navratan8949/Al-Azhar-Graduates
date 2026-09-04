import api from "./api";

// Create Crowdfunding
export const createCrowdfunding = async (data) => {
    try {
        const response = await api.post("/crowdfunding", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Crowdfundings
export const getCrowdfundings = async (params) => {
    try {
        const response = await api.get("/crowdfunding", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Crowdfunding by ID
export const getCrowdfundingById = async (id) => {
    try {
        const response = await api.get(`/crowdfunding/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Crowdfunding
export const updateCrowdfunding = async (id, data) => {
    try {
        const response = await api.put(`/crowdfunding/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Crowdfunding
export const deleteCrowdfunding = async (id) => {
    try {
        const response = await api.delete(`/crowdfunding/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
