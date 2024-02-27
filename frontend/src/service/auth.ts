import axios from 'axios';

export const adminLogin = async (admin_user: string, admin_pass: string) => {
    try {
        const res = await axios.post(`http://localhost:7031/api/admin/login`, { admin_user, admin_pass });
        return res.data;
    } catch (error) {
        console.error("Error while logging in:", error);
        throw error;
    }
}
