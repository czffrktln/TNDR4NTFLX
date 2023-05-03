import dotenv from "dotenv"
dotenv.config()
import supertest from "supertest"
import app from "../index"
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { Friendship } from "../models/friendship"

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
    const username = {username: "Nyuszika"}

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
  });

  // it("should return 404 if the user is not found", async () => {
  //   const token = process.env.TEST_TOKEN;
  //   const username = { username: "000000" };

  //   const user = new User({
  //     username: "", 
  //     sub: "12345", 
  //     email: "test@test.hu", 
  //     picture: "testurl"})
  //   await user.save()

  //   const response = await supertest(app)
  //     .post("/api/friends/friendrequest")
  //     .send(usersub)
  //     .set("Authorization", `Bearer ${token}`)
  //     .expect(404);
  // });

  // it("should return 401 if user is not authenticated", async () => {
  //   const usersub = { usersub: "12345" };

  //   const response = await supertest(app)
  //     .post("/api/friends/friendrequest")
  //     .send(usersub)
  //     .expect(401);
  // });
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

    const userid = {userid: user1._id}

    const friendship = new Friendship({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "64527a7f41a6dfed288f3eb9",
      status: "pending"
    })
    await friendship.save()

    const response = await supertest(app)
        .post("/api/friends/istherearequest")
        .send(userid)
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200)
  });

  // it("should return 204 if user not has a friendship with pending status", async () => {});
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
  });
  // it("should return 200 if friend request is denied and friendship updated with denied status", async () => {});
  // it("should return 503 if friendship update is not successful", async () => {});
});