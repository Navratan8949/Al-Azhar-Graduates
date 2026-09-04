import api from "./api";

// Create Certificate
export const createCertificate = async (data) => {
    try {
        const response = await api.post("/certificates", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Certificates (Admin)
export const getCertificates = async (params) => {
    try {
        const response = await api.get("/certificates", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get My Certificates (Member)
export const getMyCertificates = async () => {
    try {
        const response = await api.get("/certificates/me");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Certificate
export const updateCertificate = async (id, data) => {
    try {
        const response = await api.put(`/certificates/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Certificate
export const deleteCertificate = async (id) => {
    try {
        const response = await api.delete(`/certificates/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
