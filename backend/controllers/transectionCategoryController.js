const transectionCategoryModel = require("../models/transectionCategoryModel");

const transectionCategoryController = {
  getAllCategories: (req, res) => {
    transectionCategoryModel
      .getAllCategories()
      .then((categories) => {
        const totalCount = categories.length;
        res.status(200).json({ data: categories, totalCount: totalCount });
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  getCategoryById: (req, res) => {
    const categoryId = req.params.id;
    transectionCategoryModel
      .getCategoryById(categoryId)
      .then((category) => {
        if (!category) {
          return res.status(404).send("Transection category not found");
        }
        res.status(200).json(category);
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  createCategory: (req, res) => {
    const newCategory = req.body;
    transectionCategoryModel
      .createCategory(newCategory)
      .then((category) => res.status(201).json(category))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  updateCategory: (req, res) => {
    const categoryId = req.params.id;
    const updatedCategory = req.body;
    transectionCategoryModel
      .updateCategory(categoryId, updatedCategory)
      .then((category) => res.status(200).json(category))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  deleteCategory: (req, res) => {
    const categoryId = req.params.id;
    transectionCategoryModel
      .deleteCategory(categoryId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
};

module.exports = transectionCategoryController;
