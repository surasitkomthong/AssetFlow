const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route Imports
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/usersRoute")
const itemCategoryRouter = require("./routes/itemCategoryRoutes")
const unitRouter = require("./routes/unitRoutes")
const statusRouter = require("./routes/statusRoutes")
const transectionCategoryRouter = require("./routes/transectionCategoryRoutes")
const itemRouter = require("./routes/itemsRoutes")
const transectionRouter = require("./routes/transectionsRoutes")
// const authenticationRouter = require("./routes/authenticationRoutes");

// Routes
app.use(adminRouter);
app.use(userRouter);
app.use(itemCategoryRouter);
app.use(unitRouter);
app.use(statusRouter)
app.use(transectionCategoryRouter);
app.use(itemRouter);
app.use(transectionRouter);

const port = process.env.PORT;
app
  .listen(port, () => console.log(`Server is listening at http://localhost:${port}`))
  .on("error", (error) => console.error(error));