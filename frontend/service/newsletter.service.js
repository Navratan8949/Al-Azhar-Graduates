import api from "./api";

// Create Newsletter
export const createNewsletter = async (data) => {
    try {
        const response = await api.post("/newsletter/subscribe", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Newsletters
export const getNewsletters = async (params) => {
    try {
        const response = await api.get("/newsletter", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Newsletter by ID
export const getNewsletterById = async (id) => {
    try {
        const response = await api.get(`/newsletter/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Newsletter
export const updateNewsletter = async (id, data) => {
    try {
        const response = await api.put(`/newsletter/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Newsletter
export const deleteNewsletter = async (id) => {
    try {
        const response = await api.delete(`/newsletter/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
// Send Mass Newsletter
export const sendMassNewsletter = async (data) => {
    try {
        const response = await api.post(`/newsletter/send`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
