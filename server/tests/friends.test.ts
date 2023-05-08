import dotenv from "dotenv"
dotenv.config()
import supertest from "supertest"
import app from "../index"
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { Friendship } from "../models/friendship"
import { UserType } from "../models/user"
import { FriendshipType } from "../models/friendship"

beforeAll(async () => {
  await connect()
});

afterAll(async () => {
  await disconnect();
});

beforeEach(async () => {
  await clear();
});

describe("POST /friendrequest", () => {

  it("should return 200 is new friendship created and both user updated", async () => {
    const token = process.env.TEST_TOKEN
    const username = {username: "Macska"}

    const user1 = new User({
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const response = await supertest(app)
        .post("/api/friends/friendrequest")
        .send(username)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200)
    const updatedUser1 = await User.findOne({_id: user1._id}) as UserType
    const updatedUser2 = await User.findOne({_id: user2._id}) as UserType
    expect(updatedUser1.friends).toHaveLength(1)
    expect(updatedUser2.friends).toHaveLength(1)

  });

  it("should return 400 if friendship already exists", async () => {
    const token = process.env.TEST_TOKEN;
    const username = { username: "Macska" };

    const user1 = new User({
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()    

    const friendship = new Friendship({
      sender: user2._id,
      receiver: user1._id,
      status: "active"
    })
    await friendship.save()

    const response = await supertest(app)
      .post("/api/friends/friendrequest")
      .send(username)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(400);
    expect(response.text).toBe("\"Already exists.\"");
  })

  it("should return 404 if the receiver user is not found", async () => {
    const token = process.env.TEST_TOKEN;
    const username = { username: "Bambi" };

    const user1 = new User({
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const response = await supertest(app)
      .post("/api/friends/friendrequest")
      .send(username)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(404);
    expect(response.text).toBe("\"User not found.\"");
  });

  it("should return 401 if there is no token in request", async () => {
    const usersub = { usersub: "12345" };
    
    const user = new User({
      username: "", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user.save()    

    const response = await supertest(app)
      .post("/api/user/username")
      .send(usersub)
    
    expect(response.status).toEqual(401);
  });

  it("should return 403 if user is not authenticated, wrong token", async () => {
    const usersub = { usersub: "12345" };
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im55dXN6aWFsYWt1bHVmaUBnbWFpbC5jb20iLCJuYW1lIjoiNSBtc2MiLCJzdWIiOiIxMDg5NjkxMzU0OTAyOTU0NDg1NjciLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WkJxb0RQSW1Lb1R3R2paSWstX0NaTEZGeFhUU1VmNUZzalBxNU89czk2LWMiLCJfaWQiOiI2NDNjNDNjZmRhNGFmNWZkYWJjOGIxYzYiLCJmcmllbmRzIjpbXSwiX192IjowLCJpYXQiOjE2ODE2NzExMTl9.6fzTXNJAhkiFRGM9M_-VusgfArg1Sz-199X6yM8w0u0"

    const user = new User({
      username: "", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user.save()    

    const response = await supertest(app)
      .post("/api/user/username")
      .send(usersub)
      .set("Authorization", `Bearer ${token}`)
    
    expect(response.status).toEqual(403);
  });
});

describe("POST /istherearequest", () => {

  it("should return 200 if user has a friendship with pending status", async () => {
    const token = process.env.TEST_TOKEN
            
    const user1 = new User({
      _id: "64527a7f41a6dfed288f3eb9",
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const userid = {userid: user2._id}

    const friendship = new Friendship({
      _id: "6457f92a0576fe17e155a628",
      sender: "64527a7f41a6dfed288f3eb9",
      receiver: "643c43cfda4af5fdabc8b1c6",
      status: "pending"
    })
    await friendship.save()

    const response = await supertest(app)
        .post("/api/friends/istherearequest")
        .send(userid)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200)
    // console.log("response", response);
    const object = JSON.parse(response.text)
    // console.log("object", object);
    const expected = {friendshipId: "6457f92a0576fe17e155a628", id: "64527a7f41a6dfed288f3eb9", username: user1.username, picture: user1.picture}
    // console.log("expected", expected);
    expect(object).toStrictEqual(expected)
  });

  it("should return 204 if user doesm't have a friendship with pending status", async () => {
    const token = process.env.TEST_TOKEN
            
    const user1 = new User({
      _id: "64527a7f41a6dfed288f3eb9",
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const userid = {userid: user2._id}

    const friendship = new Friendship({
      _id: "6457f92a0576fe17e155a628",
      sender: "64527a7f41a6dfed288f3eb9",
      receiver: "643c43cfda4af5fdabc8b1c6",
      status: "active"
    })
    await friendship.save()

    const response = await supertest(app)
        .post("/api/friends/istherearequest")
        .send(userid)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(204)
  });
});

describe("POST /responsetorequest", () => {
  
  it("should return 202 if friend request accepted and friendship updated with active status", async () => {
    const token = process.env.TEST_TOKEN
           
    const user1 = new User({
      _id: "64527a7f41a6dfed288f3eb9",
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const friendship = new Friendship({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "64527a7f41a6dfed288f3eb9",
      status: "pending"
    })
    await friendship.save()

    const reqbody = {resp: true, friendshipId: friendship._id}
    
    const response = await supertest(app)
        .post("/api/friends/responsetorequest")
        .send(reqbody)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(202)
    const updatedFriendship = await Friendship.findById(friendship._id) as FriendshipType
    expect(updatedFriendship.status).toBe("active")
  });

  it("should return 200 if friend request is denied and friendship updated with denied status", async () => {
    const token = process.env.TEST_TOKEN
           
    const user1 = new User({
      _id: "64527a7f41a6dfed288f3eb9",
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const friendship = new Friendship({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "64527a7f41a6dfed288f3eb9",
      status: "pending"
    })
    await friendship.save()

    const reqbody = {resp: false, friendshipId: friendship._id}
    
    const response = await supertest(app)
        .post("/api/friends/responsetorequest")
        .send(reqbody)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200)
    const updatedFriendship = await Friendship.findById(friendship._id) as FriendshipType
    expect(updatedFriendship.status).toBe("denied")
  });
  
  it("should return 503 if friendship not found or not updated", async () => {
    const token = process.env.TEST_TOKEN
           
    const user1 = new User({
      _id: "64527a7f41a6dfed288f3eb9",
      username: "Macska", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl",
      friends: []
    })
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c",
      friends: []
    })
    await user2.save()

    const friendship = new Friendship({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "64527a7f41a6dfed288f3eb9",
      status: "pending"
    })
    await friendship.save()

    const reqbody = {resp: false, friendshipId: "643c43cfda4af5fdabc8b1c6"}
    
    const response = await supertest(app)
        .post("/api/friends/responsetorequest")
        .send(reqbody)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(503)
  });
});