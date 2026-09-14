import express from "express";
import cors from "cors";
import systemRoutes from "./modules/system/system.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);

export default app;