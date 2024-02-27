import axios from "axios";

export const getAllItemCategory = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/item-categories');
        return res.data;
    } catch (error) {
        console.error("Error while fetching ItemCategory:", error);
        throw error;
    }
}

export const getAllItemUnit = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/units');
        return res.data;
    } catch (error) {
        console.error("Error while fetching unit:", error);
        throw error;
    }
}

export const getAllUser = async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/users');
        return res.data;
    } catch (error) {
        console.error("Error while fetching users:", error);
        throw error;
    }
}

export const getAllTrans= async () => {
    try {
        const res = await axios.get('http://localhost:7031/api/trans-categories');
        return res.data;
    } catch (error) {
        console.error("Error while fetching trans-categories:", error);
        throw error;
    }
}

