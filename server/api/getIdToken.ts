import axios, { AxiosResponse } from "axios"
import { z } from "zod"

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

const url = "https://oauth2.googleapis.com/token"

const GoogleResponseSchema = z.object({
  id_token: z.string(),
  access_token: z.string(),
  // refresh_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.literal("Bearer")
})
type GoogleResponseType = z.infer<typeof GoogleResponseSchema>

export const getIdToken = async (code: string): Promise<string|null> => {
  
  try {
    const response: AxiosResponse = await axios.post(url, {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type: "authorization_code"
    })
    console.log("getIdToken response", response.data);
    
    const result = GoogleResponseSchema.safeParse(response.data)
    if (result.success === false) {
      console.log("getIdToken safeParse error");
      return null
    }
    return result.data.id_token
  } catch (error) {
    console.log("getIdToken error");
    return null
  }
}