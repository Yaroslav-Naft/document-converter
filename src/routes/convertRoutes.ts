import {Router} from "express";
import {Request, Response} from "express";
import {validateConversionInput} from "../utils/validators";
import {resultDocument} from "../controllers/convertController";
const router = Router();

router.post("/", validateConversionInput, resultDocument);

export default router;
