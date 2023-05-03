import express, { Express, Request, Response } from "express";
import { z } from "zod";
import { getIdToken } from "../api/getIdToken";
import { verify } from "../middlewares/verify";
import jwt from 'jsonwebtoken'
import { safeParse } from "../util/safeParse";
import { User } from "../models/user";

const router = express.Router()

const secretKey = process.env.JWT_SECRET_KEY
if (!secretKey) throw "Secret key is required"

const LoginCodeSchema = z.object({
  code: z.string()
})
type LoginCodeType = z.infer<typeof LoginCodeSchema>

const PayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string()
})
type PayloadType = z.infer<typeof PayloadSchema>

router.post("/", verify(LoginCodeSchema), async (req: Request, res: Response) => {
  const loginCode = req.body as LoginCodeType
    
  const idToken = await getIdToken(loginCode.code)
  if (!idToken) return res.status(401)

  const payload = jwt.decode(idToken)
  const safeParsedPayload = safeParse(PayloadSchema, payload)
  if (!safeParsedPayload) {
    return res.sendStatus(500)
  }

  const data = safeParsedPayload
  const findUser = await User.findOne({sub: data.sub})
  
  if (!findUser) {
    const newUser = await User.create(data)
    const sessionToken = jwt.sign(newUser.toJSON(), secretKey)
    res.send(sessionToken)
  } else {
    const updatedUser = await User.findOneAndUpdate({sub: data.sub}, {$set: data}, {returnNewDocument: true}).populate([
      { path: 'friends.friendshipId', select: ['_id', 'sender', 'receiver', 'status']}, 
      { path: 'friends.friendId', select: ['_id', 'username', 'picture']}
    ])
    if (!updatedUser) return res.sendStatus(500)
    const sessionToken = jwt.sign(updatedUser.toJSON(), secretKey)
    res.send(sessionToken)
  }
})

export default router