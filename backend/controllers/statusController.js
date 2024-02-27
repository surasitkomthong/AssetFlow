const statusModel = require("../models/statusModel");

const statusController = {
  getAllStatuses: (req, res) => {
    statusModel
      .getAllStatuses()
      .then((statuses) => {
        const totalCount = statuses.length;
        res.status(200).json({ data: statuses, totalCount: totalCount });
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  getStatusById: (req, res) => {
    const statusId = req.params.id;
    statusModel
      .getStatusById(statusId)
      .then((status) => {
        if (!status) {
          return res.status(404).send("Status not found");
        }
        res.status(200).json(status);
      })
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  createStatus: (req, res) => {
    const newStatus = req.body;
    statusModel
      .createStatus(newStatus)
      .then((status) => res.status(201).json(status))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  updateStatus: (req, res) => {
    const statusId = req.params.id;
    const updatedStatus = req.body;
    statusModel
      .updateStatus(statusId, updatedStatus)
      .then((status) => res.status(200).json(status))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },

  deleteStatus: (req, res) => {
    const statusId = req.params.id;
    statusModel
      .deleteStatus(statusId)
      .then((result) => res.status(200).json(result))
      .catch((error) => res.status(500).send("Internal Server Error"));
  },
};

module.exports = statusController;
