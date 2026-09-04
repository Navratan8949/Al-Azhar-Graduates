import api from "./api";

// Create Team
export const createTeam = async (data) => {
    try {
        const response = await api.post("/team", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Teams
export const getTeams = async (params) => {
    try {
        const response = await api.get("/team", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Team by ID
export const getTeamById = async (id) => {
    try {
        const response = await api.get(`/team/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Team
export const updateTeam = async (id, data) => {
    try {
        const response = await api.put(`/team/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Team
export const deleteTeam = async (id) => {
    try {
        const response = await api.delete(`/team/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
