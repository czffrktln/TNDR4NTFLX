// import dotenv from "dotenv"
// dotenv.config()
import supertest from "supertest"
import app from "../index"
import { connect, disconnect, clear } from "./mms.helper"
import { User } from "../models/user"
import { env } from "../util/envParser"

jest.mock("../api/getIdToken")
import { getIdToken } from "../api/getIdToken"

describe('POST /login ', () =>{
  beforeAll(connect)
  afterEach(clear)
  afterAll(disconnect)
  
  it("should return 200 and save user to the DB", async () => {
        
    // given
    const code = "as56df5w5a8d823djak"
    const token = env.TEST_TOKEN
    const mockedGetIdToken = jest.mocked(getIdToken)
    mockedGetIdToken.mockReturnValueOnce(Promise.resolve(token))
        
    // when
    const response = await supertest(app).post("/api/login").send({code})
        
    // then
    const dbContent = await User.find()

    expect(dbContent).toHaveLength(1)
    expect(response.status).toBe(200)
    })
})