import api from "./api";

// Create Event
export const createEvent = async (data) => {
    try {
        const response = await api.post("/events", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Events
export const getEvents = async (params) => {
    try {
        const response = await api.get("/events", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Event by ID
export const getEventById = async (id) => {
    try {
        const response = await api.get(`/events/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Event
export const updateEvent = async (id, data) => {
    try {
        const response = await api.put(`/events/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Event
export const deleteEvent = async (id) => {
    try {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
