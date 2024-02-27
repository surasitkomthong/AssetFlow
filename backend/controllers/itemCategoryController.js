const itemCategoryModel = require("../models/itemCategoryModel");

const itemCategoryController = {
  getAllItemCategories: (req, res) => {
    itemCategoryModel
      .getAllItemCategories()
      .then((categories) => {
        const totalCount = categories.length;
        res.status(200).json({ data: categories, totalCount: totalCount });
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  getItemCategoryById: (req, res) => {
    const categoryId = req.params.id;
    itemCategoryModel
      .getItemCategoryById(categoryId)
      .then((category) => {
        if (!category) {
          return res.status(404).send("Item category not found");
        }
        res.status(200).json(category);
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  createItemCategory: (req, res) => {
    const newCategory = req.body;
    itemCategoryModel
      .createItemCategory(newCategory)
      .then((category) => res.status(201).json(category))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  updateItemCategory: (req, res) => {
    const categoryId = req.params.id;
    const updatedCategory = req.body;
    itemCategoryModel
      .updateItemCategory(categoryId, updatedCategory)
      .then((category) => res.status(200).json(category))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  deleteItemCategory: (req, res) => {
    const categoryId = req.params.id;
    itemCategoryModel
      .deleteItemCategory(categoryId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
};

module.exports = itemCategoryController;
