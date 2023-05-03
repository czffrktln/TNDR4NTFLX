import express, { Request, Response } from "express"
import { string, z, ZodArray } from "zod"
import { User } from "../models/user"
import { UserType } from "../models/user"
import { safeParse } from "../util/safeParse"
import { verify } from "../middlewares/verify"
import { verifyToken } from "../middlewares/verifyToken"
import jwt from 'jsonwebtoken'

const router = express.Router()

const secretKey = process.env.JWT_SECRET_KEY
if (!secretKey) throw "Secret key is required"

const FindUserSchema = z.object({
  // _id: z.string(),
  sub: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string(),
  // friends: z.array().z.string()
})
type FindUserType = z.infer<typeof FindUserSchema>

const UsersubSchema = z.object({
  usersub: z.string()
})
type UsersubType = z.infer<typeof UsersubSchema>

const UsernameSchema = z.object({
  username: z.string()
})
type UsernameType = z.infer<typeof UsernameSchema>


router.post('/username', verify(UsersubSchema), verifyToken, async (req: Request, res: Response) => {
  if (!res.locals.user) return res.status(403).json("User not found.")
  const usersub = req.body as UsersubType
  const findUser = await User.findOne({sub: usersub.usersub})
  if(!findUser) return res.sendStatus(404)
  res.send(findUser.username)
})


router.post('/usernameavailable', verify(UsernameSchema), async (req: Request, res: Response) => {
  const username = req.body as UsernameType
  const findUsername = await User.findOne({username: username.username})
  if (findUsername) {
    res.send({"alreadyInUse": true})
  } else {
    res.send({"alreadyInUse": false})
  }
})


router.post('/setusername', verify(UsernameSchema), verifyToken, async (req: Request, res: Response) => { 
  const userId = res.locals.user
  const username = req.body as UsernameType
 
  const findUsername =  await User.findOne({username: username.username})
  if (findUsername) return res.send("nem jo username")
  
  const findUser = await User.findOne({_id: userId})
  if(!findUser) return res.sendStatus(500)

  const findAndUpdateUser = await User.findOneAndUpdate({_id: userId}, {username: username.username}, {returnDocument: "after"})
  if (!findAndUpdateUser) return res.status(500).json("username not set")

  const sessionToken = jwt.sign(findAndUpdateUser.toJSON(), secretKey)
  return res.status(200).json(sessionToken)
})

export default router