import express, { Request, Response } from 'express'
import { verifyToken } from '../middlewares/verifyToken'
import { User } from '../models/user'
import { Friendship } from '../models/friendship'
import { z } from 'zod'
import { verify } from '../middlewares/verify'

const router = express.Router()

const FriendRequestSchema = z.object({
  username: z.string()
})

const IsThereARequestSchema = z.object({
  userid: z.string()
})

const ResponseToRequestSchema = z.object({
  resp: z.boolean(),
  friendshipId: z.string()
})

router.post("/friendrequest", verify(FriendRequestSchema), verifyToken, async (req: Request, res: Response) => {
  const receiverUsername = req.body.username
  const findReceiver = await User.findOne({username: receiverUsername})
  if (!findReceiver) return res.status(404).json("User not found.")

  const senderId = res.locals.user
  const findSender = await User.findById(senderId)
  if (!findSender) return res.sendStatus(500)
    
  const isItNewFriendship = await Friendship.findOne({sender: senderId, receiver: findReceiver._id})
  if (isItNewFriendship) return res.status(400).json("Already exists.")
  // 400 a safeparse is  

  // azt is leellenorizni, hogy a masik e az egyik

  const newFriendship = await Friendship.create({sender: senderId, receiver: findReceiver._id, status: "pending"})
  if (!newFriendship) return res.status(503).json("Not saved in database")
  
  const updateSender = await User.findByIdAndUpdate(senderId, {
    $addToSet: {
      friends : {
        "friendshipId": newFriendship._id,
        "friendId": findReceiver._id
      }
    }}, {
      new: true
  }).populate([
    { path: 'friends.friendshipId', select: ['_id', 'sender', 'receiver', 'status']}, 
    { path: 'friends.friendId', select: ['_id', 'username', 'picture']}
  ])

  if (!updateSender) return res.sendStatus(500)

  const updateReceiver = await User.findByIdAndUpdate(findReceiver._id, {
    $addToSet: {
      friends: {
        "friendshipId": newFriendship._id,
        "friendId": findSender._id
      }
    }}, { 
      new: true
  })

  if (!updateReceiver) return res.sendStatus(500)

  console.log("updatesender", updateSender);
  console.log("updatereceiver", updateReceiver);
  
  return res.status(200).json(updateSender.friends)  
})

router.post('/istherearequest', verify(IsThereARequestSchema), verifyToken, async(req: Request, res: Response) => {
  const receiverid = req.body.userid
  const findrequest = await Friendship.findOne({receiver: receiverid, status: "pending"})
  if (!findrequest) return res.sendStatus(204)
  const sender = await User.findById(findrequest.sender)
  if (!sender) return res.sendStatus(503) // frontenden kezelni
  return res.status(200).json({friendshipId: findrequest._id, id: sender._id, username: sender.username, picture: sender.picture})
})

router.post('/responsetorequest', verify(ResponseToRequestSchema), verifyToken, async (req: Request, res: Response) => {
  if (req.body.resp) {
    const updateFriendship = await Friendship.findByIdAndUpdate(req.body.friendshipId, {status: "active"}, {new: true})
    if (!updateFriendship) return res.sendStatus(503)
    return res.status(202).json(updateFriendship)
  }
  const updateFriendship = await Friendship.findByIdAndUpdate(req.body.friendshipId, {status: "denied"})
  if (!updateFriendship) return res.sendStatus(503)
  return res.status(200).json(updateFriendship)
})

export default router