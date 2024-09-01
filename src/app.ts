const express = require("express");
import bodyParser from "body-parser";
import router from "./routes/convertRoutes";

const app = express();

app.use(bodyParser.json());

app.use("/convert", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
