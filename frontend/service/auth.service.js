import api from "./api";

export const adminLogin = async (email, password) => {
    try {
        const response = await api.post("/auth/login/admin", { emailOrMobile: email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const memberLogin = async (mobile, password) => {
    try {
        const response = await api.post("/auth/login/member", { emailOrMobile: mobile, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getmyprofile = async () => {
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const registerUser = async (data) => {
    try {
        let payload = data;
        let headers = {};
        
        // If data is FormData (has files), Axios will automatically set the correct Content-Type boundary
        if (data instanceof FormData) {
            headers = { "Content-Type": "multipart/form-data" };
        }
        
        const response = await api.post("/auth/register", payload, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}
