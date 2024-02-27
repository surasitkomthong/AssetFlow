const itemsModel = require("../models/itemsModel");

const itemsController = {
  getAllItems: (req, res) => {
    itemsModel
      .getAllItems()
      .then((items) => {
        const updatedItems = items.map(item => ({
          ...item,
          status: item.item_remain === 0 ? false : true
        }));
        const totalCount = updatedItems.length;
        res.status(200).json({ data: updatedItems, totalCount: totalCount });
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
  

  getItemById: (req, res) => {
    const itemId = req.params.id;
    itemsModel
      .getItemById(itemId)
      .then((item) => {
        if (!item) {
          return res.status(404).send("Item not found");
        }
        res.status(200).json(item);
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  createItem: (req, res) => {
    const newItem = req.body;
    itemsModel
      .createItem(newItem)
      .then((item) => res.status(201).json(item))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  updateItem: (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    itemsModel
      .updateItem(itemId, updatedItem)
      .then((item) => res.status(200).json(item))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  deleteItem: (req, res) => {
    const itemId = req.params.id;
    itemsModel
      .deleteItem(itemId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
};

module.exports = itemsController;
