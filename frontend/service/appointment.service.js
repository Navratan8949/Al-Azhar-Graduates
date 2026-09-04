import api from "./api";

// Create Appointment
export const createAppointment = async (data) => {
    try {
        const response = await api.post("/appointments", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Appointments
export const getAppointments = async (params) => {
    try {
        const response = await api.get("/appointments", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Appointment by ID
export const getAppointmentById = async (id) => {
    try {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Appointment
export const updateAppointment = async (id, data) => {
    try {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Appointment
export const deleteAppointment = async (id) => {
    try {
        const response = await api.delete(`/appointments/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
