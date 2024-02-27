const admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");

module.exports = {
  getAllAdmins: (req, res) => {
    admin
      .queryAllAdmins()
      .then((admins) => {
        const totalCount = admins.length;
        res.status(200).json({ data: admins, totalCount: totalCount });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  getAdminById: (req, res) => {
    const adminId = req.params.id;
    admin
      .queryAdminById(adminId)
      .then((result) => {
        if (!result) {
          return res.status(404).send("Admin not found");
        }
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  createAdmin: (req, res) => {
    const { admin_name, admin_user, admin_pass } = req.body;

    bcrypt.hash(admin_pass, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const newAdmin = {
        admin_name: admin_name,
        admin_user: admin_user,
        admin_pass: hash,
      };

      admin
        .createAdmin(newAdmin)
        .then((result) => {
          res.status(201).send(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Internal Server Error");
        });
    });
  },

  updateAdmin: (req, res) => {
    const adminId = req.params.id;
    const { admin_name } = req.body; // เฉพาะชื่อผู้ดูแลระบบที่จะถูกอัพเดต

    // สร้างอ็อบเจ็กต์เพื่อเก็บข้อมูลที่จะถูกอัพเดต
    const updatedAdmin = {
      admin_name: admin_name,
    };

    admin
      .updateAdmin(adminId, updatedAdmin)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },

  deleteAdmin: (req, res) => {
    const adminId = req.params.id;
    admin
      .deleteAdmin(adminId)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },
  adminLogin: (req, res) => {
    const { admin_user, admin_pass } = req.body;
    admin
      .loginAdmin({ admin_user, admin_pass }) 
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal Server Error");
      });
  },
};
