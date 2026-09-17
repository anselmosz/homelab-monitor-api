import express from "express";
import cors from "cors";
import systemRoutes from "./modules/system/system.route.js";
import servicesStatusRoute from "./modules/services-status/services-status.route.js";
import networkRoute from "./modules/network/network.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/services", servicesStatusRoute);
app.use("/network", networkRoute);

export default app;