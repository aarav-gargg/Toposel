import express from 'express'
import { login  , signup , searchUser} from '../controllers/user.controller.js';
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login" , login);
router.post("/signup" , signup)
router.get("/search/:query", authenticateUser, searchUser);

export default router;