const express = require("express");
const cors = require("cors");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const materialRoutes = require("./routes/materialRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/ai", aiRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));