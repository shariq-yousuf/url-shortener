import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import fs from "fs"

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use("/public", express.static(`${process.cwd()}/public`))
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html")
})

app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" })
})

app.post("/api/shorturl", (req, res) => {
  const reqUrl = req.body.url
  try {
    new URL(reqUrl)
  } catch (error) {
    res.json({ error: "Invalid URL" })
  }

  let shortURL = ""
  const urlSafeChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ]

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * urlSafeChars.length)
    shortURL += urlSafeChars[randomIndex]
  }

  const urlData = new Map(
    JSON.parse(fs.readFileSync(`${process.cwd()}/data/data.json`))
  )
  urlData.set(shortURL, reqUrl)

  fs.writeFile(
    `${process.cwd()}/data/data.json`,
    JSON.stringify([...urlData]),
    () => {}
  )

  res.json({
    original_url: reqUrl,
    short_url: shortURL,
  })
})

app.get("/api/shorturl/:shorturl", (req, res) => {
  const urlData = new Map(
    JSON.parse(fs.readFileSync(`${process.cwd()}/data/data.json`))
  )

  if (!urlData.has(req.params.shorturl)) res.send("URL not found!")

  res.redirect(urlData.get(req.params.shorturl))
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
