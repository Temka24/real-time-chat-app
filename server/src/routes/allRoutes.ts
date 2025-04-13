import { Router } from 'express'
import { register, login, getAllUsers } from "../controller/userController"
import { getMessage, addMessage } from "../controller/messageController"

const router = Router()

router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers/:id", getAllUsers)
router.post("/getMessage", getMessage)
router.post("/addMessage", addMessage)

export default router;