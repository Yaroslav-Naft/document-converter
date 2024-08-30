import {Router} from "express";
import {Request, Response} from "express";
const router = Router();

router.post("/", (req: Request, res: Response) => {
  res.status(200).send("post is working");
});

export default router;
