export async function fetchData(
  urlString: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  params?: { [key: string]: string } | undefined,
  headers?: { [key: string]: string } | undefined,
  body?: { [key: string]: unknown } | undefined
) {
  const url = new URL(`http://localhost:3000/api/v1/${urlString}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value as unknown as string)
    }
  }
  const myHeaders = new Headers()
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      myHeaders.append(key, value as unknown as string)
    }
  } else {
    myHeaders.append("Content-Type", "application/json")
  }
  const raw = body
    ? JSON.stringify(body)
    : JSON.stringify({ name: "Body placeholder" })
  const reqOptions = {
    method: method,
    headers: myHeaders,
    body: raw,
  }
  return await fetch(url, {
    ...reqOptions,
    credentials: "include",
  })
    .then((res) => res.json())
    .catch((err) => ({
      success: "false",
      error: `Something went wrong on the frontend. ${JSON.stringify(err)}`,
    }))
}
