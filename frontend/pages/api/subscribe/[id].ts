import { NextApiRequest, NextApiResponse } from 'next'
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]";
import axios from "axios";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export async function getToken(): Promise<string> {
  const response = await client.post("/auth/local", {
    identifier: process.env.USERNAME,
    password: process.env.PASSWORD
  })
  return response.data.jwt
}

export default async function subscribeRoute(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const token = await getToken()
  const response = await client.post("/subscriptions", {
    data: {
      user: session?.id,
      event: req.query.id,
    },
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  console.log(response.data)
  res.json({ id: response.data.data.id })
}
