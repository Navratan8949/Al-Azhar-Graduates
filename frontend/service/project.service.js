import api from "./api";

// Create Project
export const createProject = async (data) => {
    try {
        const response = await api.post("/projects", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Projects
export const getProjects = async (params) => {
    try {
        const response = await api.get("/projects", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Project by ID
export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Project
export const updateProject = async (id, data) => {
    try {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Project
export const deleteProject = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
