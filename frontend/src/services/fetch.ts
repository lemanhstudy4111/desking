export async function fetchData(
  urlString: string,
  params: { [key: string]: string },
  headers: { [key: string]: string } | undefined,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body: { [key: string]: unknown } | undefined
) {
  const url = new URL(`http://localhost:3000/api/v1/${urlString}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value as unknown as string)
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
  return await fetch(url, reqOptions)
    .then((res) => res.json())
    .catch((err) => ({
      success: "false",
      error: `Something went wrong on the frontend. ${JSON.stringify(err)}`,
    }))
}
