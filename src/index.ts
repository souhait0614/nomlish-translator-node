import baseFetch from "cross-fetch"
import makeFetchCookie from "fetch-cookie"

const fetch = makeFetchCookie(baseFetch)

export interface Parameter {
  level?: 1 | 2 | 3 | 4
  options?: "nochk" | "p0chk" | "p100chk"
}

const initParameter = {
  level: 2,
  options: "nochk",
} as const satisfies Required<Parameter>

interface FullParameter extends Required<Parameter> {
  token: string
  transbtn: string
  before: string
}

const getText = (res: Response) => {
  if (!res.ok) throw new Error(res.statusText)
  return res.text()
}

const nomlishUrl = "https://racing-lagoon.info/nomu/translate.php"
const csrf = "CSRF check failed"

export const getToken = async () => {
  const html = await fetch(nomlishUrl).then(getText)
  const [input] = html.match(/<input.*name="token".*?>/) ?? [""]
  const token = input.replace(/(^<.*value="|".*?\/?>$)/g, "")
  if (!token) throw new Error("Failed to get token")
  return token
}

export const getOutput = async (
  input: string,
  token: string,
  { level, options }: Required<Parameter>
) => {
  const fullParam: FullParameter = {
    before: input,
    level,
    options,
    token,
    transbtn: "",
  }
  const body = new URLSearchParams(Object.entries(fullParam)).toString()

  const html = await fetch(nomlishUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  }).then(getText)
  if (html.includes(csrf)) throw new Error("CSRF check failed")
  const [textarea] = html.match(/<textarea.*name="after1".*?>[\S\s]*?<\/textarea>/) ?? [""]
  const output = textarea.replace(/(^<.*?>|<\/.*?>$)/g, "")

  if (!output) throw new Error("Failed to get output")
  return output
}

export class Translator {
  #token: Promise<string>

  #defaultParameter: Required<Parameter>

  constructor(defaultParameter: Parameter = {}) {
    this.#token = getToken()
    this.#defaultParameter = {
      ...initParameter,
      ...defaultParameter,
    }
  }

  async translate(input: string, param: Parameter = {}) {
    if (!input) throw new Error("No input")
    const token = await this.#token

    const fixedParam = {
      ...this.#defaultParameter,
      ...param,
    }

    try {
      return await getOutput(input, token, fixedParam)
    } catch {
      this.#token = getToken()
      const refetchToken = await this.#token
      return getOutput(input, refetchToken, fixedParam)
    }
  }
}

export const translate = async (input: string, param: Parameter = {}) => {
  if (!input) throw new Error("No input")
  const token = await getToken()

  const fixedParam = {
    ...initParameter,
    ...param,
  }

  try {
    return await getOutput(input, token, fixedParam)
  } catch {
    const refetchToken = await getToken()
    return getOutput(input, refetchToken, fixedParam)
  }
}
