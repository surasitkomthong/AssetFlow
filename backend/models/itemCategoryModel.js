const { pool } = require('../db/db-config');

const itemCategoryModel = {
  getAllItemCategories: async () => {
    try {
      const categoryData = await pool.promise().query('SELECT * FROM item_category');
      
      const resultPromises = categoryData[0].map(async (category) => {
        const queryResult = await pool.promise().query(`SELECT COUNT(*) AS count FROM items WHERE item_cat = '${category.item_cat_id}'`);
        const rowCount = queryResult[0][0].count;
        return { ...category, isReferenced: rowCount > 0 };
      });
  
      const categorizedItems = await Promise.all(resultPromises);
      return categorizedItems;
    } catch (error) {
      console.error('Error getting item categories:', error);
      throw error;
    }
  },

  getItemCategoryById: (categoryId) => {
    return pool.promise().query('SELECT * FROM item_category WHERE item_cat_id = ?', [categoryId])
      .then(([rows]) => rows[0])
      .catch(error => {
        console.error('Error getting item category by ID:', error);
        throw error;
      });
  },

  createItemCategory: (newCategory) => {
    const { item_cat_name } = newCategory;
    return pool.promise().query('INSERT INTO item_category (item_cat_name) VALUES (?)', [item_cat_name])
      .then(result => ({ id: result.insertId, ...newCategory }))
      .catch(error => {
        console.error('Error creating item category:', error);
        throw error;
      });
  },

  updateItemCategory: (categoryId, updatedCategory) => {
    const { item_cat_name } = updatedCategory;
    return pool.promise().query('UPDATE item_category SET item_cat_name = ? WHERE item_cat_id = ?', [item_cat_name, categoryId])
      .then(() => ({ id: categoryId, ...updatedCategory }))
      .catch(error => {
        console.error('Error updating item category:', error);
        throw error;
      });
  },

  deleteItemCategory: (categoryId) => {
    return pool.promise().query('DELETE FROM item_category WHERE item_cat_id = ?', [categoryId])
      .then(() => ({ id: categoryId, message: 'Item category deleted successfully' }))
      .catch(error => {
        console.error('Error deleting item category:', error);
        throw error;
      });
  }
};

module.exports = itemCategoryModel;
