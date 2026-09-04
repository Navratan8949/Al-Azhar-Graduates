import api from "./api";

// Create Donation
export const createDonation = async (data) => {
    try {
        const response = await api.post("/donations", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Donations
export const getDonations = async (params) => {
    try {
        const response = await api.get("/donations", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Donation by ID
export const getDonationById = async (id) => {
    try {
        const response = await api.get(`/donations/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Donation
export const updateDonation = async (id, data) => {
    try {
        const response = await api.put(`/donations/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Donation
export const deleteDonation = async (id) => {
    try {
        const response = await api.delete(`/donations/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
