import app from "./src/app.js";
import "./src/config/env.js";

const port = process.env.PORT || 3000;
const env_type = process.env.NODE_ENV || "development";

app.listen(port, () => {
  console.log(`\n (${env_type}) server running at port ${port}`);
});

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));