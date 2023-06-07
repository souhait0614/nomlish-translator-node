import axios from "axios"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"

const jar = new CookieJar()
const client = wrapper(axios.create({ jar }))

export interface Parameter {
  level?: 1 | 2 | 3 | 4
  options?: "nochk" | "p0chk" | "p100chk"
}

const defaultParameter = {
  level: 2,
  options: "nochk",
} as const satisfies Required<Parameter>

interface FullParameter extends Required<Parameter> {
  token: string
  transbtn: string
  before: string
}
const nomlishUrl = "https://racing-lagoon.info/nomu/translate.php"

export const getToken = async () => {
  const { data } = await client.get<string>(nomlishUrl)
  const [input] = data.match(/<input.*name="token".*?>/) ?? [""]
  const token = input.replace(/(^<.*value="|".*?\/?>$)/g, "")

  if (!token) throw new Error("Failed to get token")
  return token
}

export const translate = async (input: string, param: Parameter = {}) => {
  if (!input) throw new Error("No input")
  const token = await getToken()

  const { level, options } = {
    ...defaultParameter,
    ...param,
  }
  const fullParam: FullParameter = {
    before: input,
    level,
    options,
    token,
    transbtn: "翻訳",
  }
  const body = new URLSearchParams(Object.entries(fullParam)).toString()

  const { data } = await client.post<string>(nomlishUrl, body)
  const [textarea] = data.match(/<textarea.*name="after1".*?>[\S\s]*?<\/textarea>/) ?? [""]
  const output = textarea.replace(/(^<.*?>|<\/.*?>$)/g, "")

  if (!output) throw new Error("Failed to get output")
  return output
}