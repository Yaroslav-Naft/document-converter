const express = require("express");
import bodyParser from "body-parser";
import {resultDocument} from "./controllers/convertController";

const app = express();

app.use(bodyParser.json());

app.use("/convert", resultDocument);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
