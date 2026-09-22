import express from "express";
import cors from "cors";
import systemRoutes from "./modules/system/system.route.js";
import servicesStatusRoute from "./modules/services-status/services-status.route.js";
import networkRoute from "./modules/network/network.route.js";
import deployRouter from "./modules/deploy/deploy.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/system", systemRoutes);
app.use("/services", servicesStatusRoute);
app.use("/network", networkRoute);
app.use("/deploy", deployRouter);

export default app;

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));