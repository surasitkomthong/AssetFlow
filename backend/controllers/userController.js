const userModel = require("../models/userModel");

module.exports = {
  getAllUsers: (req, res) => {
    userModel
      .getAllUsers()
      .then((users) => {
        const totalCount = users.length;
        res.status(200).json({ data: users, totalCount: totalCount });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  getUserById: (req, res) => {
    const userId = req.params.id;
    userModel
      .getUserById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  createUser: (req, res) => {
    const userData = req.body;
    userModel
      .createUser(userData)
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  updateUser: (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    userModel
      .updateUser(userId, userData)
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  deleteUser: (req, res) => {
    const userId = req.params.id;
    userModel
      .deleteUser(userId)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },
};
