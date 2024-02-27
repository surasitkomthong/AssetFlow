const transectionsModel = require("../models/transectionsModel");

module.exports = {
  getAllTransections: (req, res) => {
    transectionsModel
      .getAllTransections()
      .then((transections) => {
        const totalCount = transections.length;
        {
          res.status(200).json({ data: transections, totalCount: totalCount });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },

  getTransectionById: (req, res) => {
    const transId = req.params.id;
    transectionsModel
      .getTransectionById(transId)
      .then((transection) => {
        if (!transection) {
          return res.status(404).send("Transection not found");
        }
        res.status(200).json({ transection });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },

  createTransection: (req, res) => {
    const newTransection = req.body;
    transectionsModel
      .createTransection(newTransection)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },

  updateTransection: (req, res) => {
    const transId = req.params.id;
    const updatedTransection = req.body;
    transectionsModel
      .updateTransection(transId, updatedTransection)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },

  deleteTransection: (req, res) => {
    const transId = req.params.id;
    transectionsModel
      .deleteTransection(transId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },

  returnItemsAndUpdate: (req, res) => {
    const transId = req.params.id;
    const data = req.body;
    transectionsModel
      .returnItemsAndUpdate(transId, data)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  },
};
