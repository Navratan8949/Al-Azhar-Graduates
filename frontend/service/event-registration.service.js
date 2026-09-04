import api from "./api";

// Create EventRegistration
export const createEventRegistration = async (data) => {
    try {
        const response = await api.post("/event-registrations", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All EventRegistrations
export const getEventRegistrations = async (params) => {
    try {
        const response = await api.get("/event-registrations", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get EventRegistration by ID
export const getEventRegistrationById = async (id) => {
    try {
        const response = await api.get(`/event-registrations/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update EventRegistration
export const updateEventRegistration = async (id, data) => {
    try {
        const response = await api.put(`/event-registrations/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete EventRegistration
export const deleteEventRegistration = async (id) => {
    try {
        const response = await api.delete(`/event-registrations/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Custom endpoints for Event Registration
export const registerForEvent = async (data) => {
    try {
        const response = await api.post("/event-registration/register", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRegistrationsByEvent = async (eventId) => {
    try {
        const response = await api.get(`/event-registration/event/${eventId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateRegistrationStatus = async (id, status) => {
    try {
        const response = await api.put(`/event-registration/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};
