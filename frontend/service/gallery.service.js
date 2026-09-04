import api from "./api";

// Create Gallery
export const createGallery = async (data) => {
    try {
        const response = await api.post("/gallery", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Gallery Items
export const getGalleryItems = async (params) => {
    try {
        const response = await api.get("/gallery", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Gallery by ID
export const getGalleryById = async (id) => {
    try {
        const response = await api.get(`/gallery/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Gallery
export const updateGallery = async (id, data) => {
    try {
        const response = await api.put(`/gallery/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Gallery
export const deleteGallery = async (id) => {
    try {
        const response = await api.delete(`/gallery/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
