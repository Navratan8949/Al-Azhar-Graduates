import api from "./api";

// Create User
export const createUser = async (data) => {
    try {
        const response = await api.post("/users", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Users
export const getUsers = async (params) => {
    try {
        const response = await api.get("/users", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get User by ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update User
export const updateUser = async (id, data) => {
    try {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete User
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
