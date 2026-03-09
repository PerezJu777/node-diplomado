import { Router } from "express";
import authControler from "../controllers/auth.controler.js";
import { schema } from "../validators/user.validate.js";
import validate from "../validators/validate.js";

const router = Router();
router.post('/', validate(schema), authControler.login);

export default router;