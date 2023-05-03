import dotenv from "dotenv"
dotenv.config()
import supertest from "supertest"
import app from "../index"
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { Pair } from "../models/pair";
import { Movie } from "../models/movie";

beforeAll(async () => {
  await connect()
});

afterAll(async () => {
  await disconnect();
});

beforeEach(async () => {
  await clear();
});

describe("POST /sendpairrequest", () => {

  it("should return 200 a new pair id with status: 'pending' ", async () => {
    const token = process.env.TEST_TOKEN
    
    const user1 = new User({
      username: "Teszt", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()
      
    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
    await user2.save()
    
    const receiverid = {receiverId: user1._id}
        
    const response = await supertest(app)
      .post("/api/pairs/sendpairrequest")
      .send(receiverid)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(200);
  });

  it("should return 500 if the user is not found", async () => {
    const token = process.env.TEST_TOKEN;
    const receiverid = {receiverId: "643c43cfda4af5fdabc8b1c7"}

    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
    await user2.save()
    
    const response = await supertest(app)
      .post("/api/pairs/sendpairrequest")
      .send(receiverid)
      .set("Authorization", `Bearer ${token}`)
    expect(response.status).toEqual(500);
  });

  it("should return 401 if user is not authenticated", async () => {
    const receiverid = {receiverId: "12345"}

    const response = await supertest(app)
      .post("/api/pairs/sendpairrequest")
      .send(receiverid)
    expect(response.status).toEqual(401);
  });
});

describe("POST /istherearequest", () => {
  it("should return 200 and a pair", async () => {
    const token = process.env.TEST_TOKEN
    
    const user1 = new User({
      username: "", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()
      
    const user2 = new User({
      username: "", 
      sub: "11111", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user2.save()
        
    const pair = new Pair({
      sender: user1,
      receiver: user2._id,
      status: "pending",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: [],
      moviesSenderDisliked: [],
      moviesReceiverLiked: [],
      moviesReceiverDisliked: [],
    })
    await pair.save()
        
    const userid = {userid: user2._id}
    
    const response = await supertest(app)
      .post("/api/pairs/istherearequest")
      .send(userid)
      .set("Authorization", `Bearer ${token}`);
      
    expect(response.status).toEqual(200);
  });
  
//   it("should return 204 if pair not found", async () => {
//     const token = process.env.TEST_TOKEN;
//     const userid = {userid: "12345"}
  
//     const response = await supertest(app)
//       .post("/api/pairs/istherearequest")
//       .send(userid)
//       .set("Authorization", `Bearer ${token}`)
//     expect(response.status).toEqual(204);
//   });

//   it("should return 401 if user is not authenticated", async () => {
//     const receiverid = {receiverId: "12345"}

//     const response = await supertest(app)
//       .post("/api/pairs/isrequestaccepted")
//       .send(receiverid)
//     expect(401);
//   });
});

describe("POST /isrequestaccepted", () => {

  it("should return 200 if pair.status: 'active' ", async () => {
    const token = process.env.TEST_TOKEN

    const pair = new Pair({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "643c43cfda4af5fdabc8b1c6",
      status: "active",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: [],
      moviesSenderDisliked: [],
      moviesReceiverLiked: [],
      moviesReceiverDisliked: [],
    })
    await pair.save()

    const pairid = {pairid: pair._id}

    const response = await supertest(app)
      .post("/api/pairs/isrequestaccepted")
      .send(pairid)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toEqual(200);
  });

//   it("should return 204 if pair with active status is not found", async () => {
//     const token = process.env.TEST_TOKEN;
//     const pairid = {pairid: "12345"}

//     const response = await supertest(app)
//       .post("/api/pairs/isrequestaccepted")
//       .send(pairid)
//       .set("Authorization", `Bearer ${token}`)
//     expect(204);
//   });

//   it("should return 401 if user is not authenticated", async () => {
//     const receiverid = {receiverId: "12345"}

//     const response = await supertest(app)
//       .post("/api/pairs/isrequestaccepted")
//       .send(receiverid)
//     expect(401);
//   });
});


describe("POST /responsetopairrequest", () => {

  it("should return 200 if pair status is updated", async () => {
    const token = process.env.TEST_TOKEN
    const resp = {resp: "accept"}

    const pair = new Pair({
      sender: "643c43cfda4af5fdabc8b1c6",
      receiver: "643c43cfda4af5fdabc8b1c6",
      status: "pending",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: [],
      moviesSenderDisliked: [],
      moviesReceiverLiked: [],
      moviesReceiverDisliked: [],
    })
    await pair.save()

    const pairid = {pairId: pair._id}

    const response = await supertest(app)
      .post("/api/pairs/responsetopairrequest")
      .send(pairid)
      .send(resp)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
  });

//   it("should return 500 if pair is not updated", async () => {
//     const token = process.env.TEST_TOKEN;
//     const pairid = {pairid: "12345"}
//     const resp = "accept"

//     const response = await supertest(app)
//       .post("/api/pairs/responsetopairrequest")
//       .send(pairid)
//       .send(resp)
//       .set("Authorization", `Bearer ${token}`)
//     // expect(500);
//     expect(response.status).toEqual(500);
//   });

//   it("should return 401 if user is not authenticated", async () => {
//     const pairid = {pairid: "12345"}
//     const resp = "accept"

//     const response = await supertest(app)
//       .post("/api/pairs/responsetopairrequest")
//       .send(pairid)
//       .send(resp)
//     expect(401);
//   });
})

describe("POST /isthereamatch", () => {
  it("should return 200 if both user liked the same movie", async () => {
    const token = process.env.TEST_TOKEN

    const user1 = new User({
      username: "", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user1.save()
      
    const user2 = new User({
      username: "", 
      sub: "11111", 
      email: "test@test.hu", 
      picture: "testurl"})
    await user2.save()

    const pair = new Pair({
      sender: user1._id,
      receiver: user2._id,
      status: "pending",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: ["64492cf7797ec449371756b0"],
      moviesSenderDisliked: [],
      moviesReceiverLiked: ["64492cf7797ec449371756b0"],
      moviesReceiverDisliked: [],
    })
    await pair.save()

    const pairid = {pairId: pair._id}

    const movie = new Movie({
      _id: "64492cf7797ec449371756b0",
      cast: [
        "Gabriella Hámori",
        "Péter Scherer",
        "Zsolt Nagy",
        "János Kulka",
        "Viktória Staub",
        "Ákos Orosz"
      ],
      countries: [ "HU" ],
      directors: [ "Péter Fazakas" ],
      genres: [
        {
          id: 18,
          name: "Drama",
          _id: "64492cf7797ec449371756b1"
        }
      ],
      imdbId: "tt13400142",
      imdbRating: 70,
      originalLanguage: "hu",
      originalTitle: "A játszma",
      overview: "During the Cold War, the secret service of Kádár began a more dangerous state security game than ever before.",
      posterURL: "https://image.tmdb.org/t/p/original/iikGOkF5pIMhJW0TdQHgiePry79.jpg",
      runtime: 112,
      title: "The Game",
      year: 2022,
      __v: 0
    })
  
    await movie.save()
    
    const response = await supertest(app)
      .post("/api/pairs/isthereamatch")
      .send(pairid)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toEqual(200);
  });
  
//   it("should return 500 if pair not found", async () => {
//     const token = process.env.TEST_TOKEN;
//     const pairid = {pairid: "12345"}
  
//     const response = await supertest(app)
//       .post("/api/pairs/isthereamatch")
//       .send(pairid)
//       .set("Authorization", `Bearer ${token}`)
//     expect(500);
//   });

//   it("should return 401 if user is not authenticated", async () => {
//     const pairid = {pairid: "12345"}

//     const response = await supertest(app)
//       .post("/api/pairs/isthereamatch")
//       .send(pairid)
//     expect(401);
//   });
});