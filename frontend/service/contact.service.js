import api from "./api";

// Create Contact
export const createContact = async (data) => {
    try {
        const response = await api.post("/contact", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Contacts
export const getContacts = async (params) => {
    try {
        const response = await api.get("/contact", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Contact by ID
export const getContactById = async (id) => {
    try {
        const response = await api.get(`/contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Contact
export const updateContact = async (id, data) => {
    try {
        const response = await api.put(`/contact/${id}/status`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Contact
export const deleteContact = async (id) => {
    try {
        const response = await api.delete(`/contact/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
