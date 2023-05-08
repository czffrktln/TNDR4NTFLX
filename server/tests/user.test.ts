import dotenv from "dotenv"
dotenv.config()
import supertest from "supertest"
import app from "../index"
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { object } from "zod"
import { UserType } from "../models/user"

beforeAll(async () => {
  await connect()
});

afterAll(async () => {
  await disconnect();
});

beforeEach(async () => {
  await clear();
});

describe("POST /username", () => {

  it("should return the username of an existing user", async () => {
    const token = process.env.TEST_TOKEN
    const usersub = {usersub: "12345"}

    const user = new User({
      username: "", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user.save()

    const response = await supertest(app)
      .post("/api/user/username")
      .send(usersub)
      .set("Authorization", `Bearer ${token}`);

    expect(response.text).toEqual(user.username);
  });

  it("should return 404 if the user is not found", async () => {
    const token = process.env.TEST_TOKEN;
    const usersub = { usersub: "000000" };

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
    
    expect(response.status).toEqual(404);
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


describe("POST /usernameavailable", () => {
  
  it("should return that the username is available or not", async () => {
    const token = process.env.TEST_TOKEN
    const username = {username: "Katica"}

    const user1 = new User({
      username: "Bambi", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()

    const user2 = new User({
      username: "Bombi", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user2.save()

    const user3 = new User({
      username: "Katica", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user3.save()

    const response = await supertest(app)
        .post("/api/user/usernameavailable")
        .send(username)
        .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({"alreadyInUse": true});
  });

  it("should return that the username is available or not", async () => {
    const token = process.env.TEST_TOKEN
    const username = {username: "Roka"}

    const user1 = new User({
      username: "Bambi", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()

    const user2 = new User({
      username: "Bombi", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user2.save()

    const user3 = new User({
      username: "Katica", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user3.save()

    const response = await supertest(app)
        .post("/api/user/usernameavailable")
        .send(username)
        .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({"alreadyInUse": false});
  });  

  it("should return 400 if the req.body is not an object with username key and a string value", async () => {
    const username = "Bambi";
    const token = process.env.TEST_TOKEN

    const response = await supertest(app)
      .post("/api/user/usernameavailable")
      .send(username)
      .set("Authorization", `Bearer ${token}`);      

    expect(response.status).toEqual(400);
  });
});


describe("POST /setusername", () => {
  
  it("should return 200 if the username is set and sessionToken created", async () => {
    const token = process.env.TEST_TOKEN
    const username = {username: "Nyuszika"}
        
    const user = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
      await user.save()
      
    
    const response = await supertest(app)
      .post("/api/user/setusername")
      .send(username)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    const updatedUser = await User.findOne({_id: user._id}) as UserType
    expect(updatedUser.username).toHaveLength
  });

  it("should return 'nem jo username' if username is already taken", async () => {
    const token = process.env.TEST_TOKEN;
    const username = { username: "Nyuszika" };

    const user1 = new User({
      username: "Nyuszika", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()

    const user2 = new User({
      username: "Bombi", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user2.save()

    const user3 = new User({
      username: "Katica", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user3.save()

    const response = await supertest(app)
      .post("/api/user/setusername")
      .send(username)
      .set("Authorization", `Bearer ${token}`)
      
    expect(response.text).toEqual("nem jo username");
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
