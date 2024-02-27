import axios from 'axios';

export const getAllItemCategory = async () => {
  try {
    const res = await axios.get('http://localhost:7031/api/item-categories');
    return res.data;
  } catch (error) {
    console.error('Error while fetching:', error);
    throw error;
  }
};

export const createItemCategory = async (data: any) => {
  try {
    const res = await axios.post('http://localhost:7031/api/item-categories', data);
    return res.data;
  } catch (error) {
    console.error('Error while posting item category:', error);
    throw error;
  }
};

export const deleteItemCategory = async (id: number) => {
  try {
    const res = await axios.delete(`http://localhost:7031/api/item-categorie/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error while deleting item category:', error);
    throw error;
  }
};

export const updateItemCategory = async (id: number, data: any) => {
  try {
    const res = await axios.put(`http://localhost:7031/api/item-categorie/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error while updating item category:', error);
    throw error;
  }
};

export const getAllUnit = async () => {
  try {
    const res = await axios.get('http://localhost:7031/api/units');
    return res.data;
  } catch (error) {
    console.error('Error while fetching:', error);
    throw error;
  }
};

export const createUnit = async (data: any) => {
  try {
    const res = await axios.post('http://localhost:7031/api/units', data);
    return res.data;
  } catch (error) {
    console.error('Error while posting unit:', error);
    throw error;
  }
};

export const deleteUnit = async (id: number) => {
  try {
    const res = await axios.delete(`http://localhost:7031/api/unit/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error while deleting', error);
    throw error;
  }
};

export const updateUnit = async (id: number, data: any) => {
  try {
    const res = await axios.put(`http://localhost:7031/api/unit/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error while updating:', error);
    throw error;
  }
};

export const getAllTransactionCategory = async () => {
  try {
    const res = await axios.get('http://localhost:7031/api/trans-categories');
    return res.data;
  } catch (error) {
    console.error('Error while fetching:', error);
    throw error;
  }
};

export const deleteTransactionCategory = async (id: number) => {
  try {
    const res = await axios.delete(`http://localhost:7031/api/trans-category/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error while deleting', error);
    throw error;
  }
};

export const createTransactionCategory = async (data: any) => {
  try {
    const res = await axios.post('http://localhost:7031/api/trans-categories', data);
    return res.data;
  } catch (error) {
    console.error('Error while posting:', error);
    throw error;
  }
};

export const updateTransactionCategory = async (id: number, data: any) => {
  try {
    const res = await axios.put(`http://localhost:7031/api/trans-category/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error while updating:', error);
    throw error;
  }
};
