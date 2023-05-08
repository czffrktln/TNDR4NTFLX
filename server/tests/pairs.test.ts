import dotenv from "dotenv"
dotenv.config()
import supertest from "supertest"
import app from "../index"
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { Pair, PairType } from "../models/pair";
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
      .post("/api/pairs/sendpairrequest")
      .send(receiverid)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(200);
    const newPair = await Pair.findOne({sender: user2._id, receiver: user1._id}) as PairType
    expect(newPair.status).toBe("pending")
    expect(newPair.moviesTheyChoosingFrom).toHaveLength(1)
  });

  it("should return 500 if the user is not found", async () => {
    const token = process.env.TEST_TOKEN;
    const receiverid = {receiverId: "643c43cfda4af5fdabc8b1c7"}

    const user1 = new User({
      username: "Teszt", 
      sub: "12345", 
      email: "test@test.hu", 
      picture: "testurl"
    })
    await user1.save()

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
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
    await user2.save()
        
    const pair = new Pair({
      _id: "6458c35792e072cb400c5dd3",
      sender: user1._id,
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

    // const pairr = await Pair.findOne({receiver: user2._id}).populate('sender')
    // console.log("pair", pair);
    // console.log("pairr", pairr);
    // console.log("response", JSON.parse(response.text));
    // expect(JSON.parse(response.text)).toEqual({pair: pairr})
  });
  
  it("should return 204 if pair not found", async () => {
    const token = process.env.TEST_TOKEN;

    const user1 = new User({
      username: "", 
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

    const userid = {userid: user2._id}
  
    const response = await supertest(app)
      .post("/api/pairs/istherearequest")
      .send(userid)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(204);
  });
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
    expect(response.body.status).toBe(pair.status)
  });

  it("should return 204 if pair with active status is not found", async () => {
    const token = process.env.TEST_TOKEN;

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

    const pairid = {pairid: pair._id}    

    const response = await supertest(app)
      .post("/api/pairs/isrequestaccepted")
      .send(pairid)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(204);
  });
});


describe("POST /responsetopairrequest", () => {

  it("should return 200 if pair request is accepted and pair status is active", async () => {
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
    expect(response.body.status).toBe("active")
  });

  it("should return 200 and 'Pairing denied' if pair request is denied and pair status is denied", async () => {
    const token = process.env.TEST_TOKEN
    const resp = {resp: "denied"}

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
    expect(response.text).toBe('\"Pairing denied\"')
    const updatedPair = await Pair.findById(pair._id) as PairType
    expect(updatedPair.status).toBe("denied")
  });

  it("should return 500 if pair not found", async () => {
    const token = process.env.TEST_TOKEN;

    const user2 = new User({
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
    await user2.save()
    
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
    
    const request = {pairId: pair._id, resp: "accept"}

    const response = await supertest(app)
      .post("/api/pairs/responsetopairrequest")
      .send(request)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(500);
  });
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
      _id: "643c43cfda4af5fdabc8b1c6",
      username: "Nyuszika", 
      sub: "108969135490295448567", 
      email: "nyuszialakulufi@gmail.com", 
      picture: "https://lh3.googleusercontent.com/a/AGNmyxZBqoDPImKoTwGjZIk-_CZLFFxXTSUf5FsjPq5O=s96-c"
    })
    await user2.save()

    const pair = new Pair({
      _id: "64492cf7797ec449371756b0",
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

    // console.log("responsebody", response.body);
    // console.log("moveie", movie);
    // expect(response.body).toBe(movie)
  });
  
  it("should return 204 if there is no movie that both user liked", async () => {
    const token = process.env.TEST_TOKEN

    const user1 = new User({
      username: "", 
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

    const pair = new Pair({
      _id: "64492cf7797ec449371756b0",
      sender: user1._id,
      receiver: user2._id,
      status: "pending",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: ["64492cf7797ec449371756b0"],
      moviesSenderDisliked: [],
      moviesReceiverLiked: ["64492cf1121ec664371756b0"],
      moviesReceiverDisliked: [],
    })
    await pair.save()

    const pairid = {pairId: pair._id}

    const response = await supertest(app)
      .post("/api/pairs/isthereamatch")
      .send(pairid)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toEqual(204);

  });

  it("should return 500 if pair not found", async () => {
    const token = process.env.TEST_TOKEN;
    const request = {pairId: "64492cf7797ec449371756b0", resp: "accept"}
  
    const response = await supertest(app)
      .post("/api/pairs/isthereamatch")
      .send(request)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(500);
  });
 
});

describe("POST /likemovie", () => {

  it("should return 200 if it's a match", async () => {
    const token = process.env.TEST_TOKEN
  
    const user1 = new User({
      username: "", 
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

    const pair = new Pair({
      sender: user2._id,
      receiver: user1._id,
      status: "active",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: [],
      moviesSenderDisliked: [],
      moviesReceiverLiked: [movie._id],
      moviesReceiverDisliked: [],
    })
    await pair.save()    

    const request = {resp: true, pairId: pair._id, movieId: movie._id}    

    const response = await supertest(app)
      .post("/api/pairs/likemovie")
      .send(request)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toEqual(200);
    expect(response.text).toBe("\"it's a match\"")
  });

  it("should return 204 if pair is updated, but it is not a match", async () => {
    const token = process.env.TEST_TOKEN
  
    const user1 = new User({
      username: "", 
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

    const pair = new Pair({
      sender: user2._id,
      receiver: user1._id,
      status: "active",
      moviesTheyChoosingFrom: [],
      moviesSenderLiked: [],
      moviesSenderDisliked: [],
      moviesReceiverLiked: ["64492cf7797ec449371890b1"],
      moviesReceiverDisliked: [],
    })
    await pair.save()    

    const request = {resp: true, pairId: pair._id, movieId: movie._id}    

    const response = await supertest(app)
      .post("/api/pairs/likemovie")
      .send(request)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toEqual(204);
    const updatedPair = await Pair.findById(pair._id) as PairType
    expect(updatedPair.moviesSenderLiked).toStrictEqual([movie._id])
  });
});