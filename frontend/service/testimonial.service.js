import api from "./api";

// Create Testimonial
export const createTestimonial = async (data) => {
    try {
        const response = await api.post("/testimonials", data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get All Testimonials
export const getTestimonials = async (params) => {
    try {
        const response = await api.get("/testimonials", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get Testimonial by ID
export const getTestimonialById = async (id) => {
    try {
        const response = await api.get(`/testimonials/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update Testimonial
export const updateTestimonial = async (id, data) => {
    try {
        const response = await api.put(`/testimonials/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete Testimonial
export const deleteTestimonial = async (id) => {
    try {
        const response = await api.delete(`/testimonials/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
