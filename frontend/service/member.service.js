import api from "./api";

// Create Member
export const createMember = async (data) => {
    try {
        const response = await api.post("/members", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Members
export const getMembers = async (params) => {
    try {
        const response = await api.get("/members", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Member by ID
export const getMemberById = async (id) => {
    try {
        const response = await api.get(`/members/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Member
export const updateMember = async (id, data) => {
    try {
        const response = await api.put(`/members/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Member
export const deleteMember = async (id) => {
    try {
        const response = await api.delete(`/members/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
