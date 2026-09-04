import api from "./api";

// Create News
export const createNews = async (data) => {
    try {
        const response = await api.post("/news", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All News
export const getNews = async (params) => {
    try {
        const response = await api.get("/news", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get News by ID
export const getNewsById = async (id) => {
    try {
        const response = await api.get(`/news/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update News
export const updateNews = async (id, data) => {
    try {
        const response = await api.put(`/news/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete News
export const deleteNews = async (id) => {
    try {
        const response = await api.delete(`/news/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
