import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import path from "path"

import connectdb from "./config/db.js"

dotenv.config()
connectdb()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.PORT || 4000


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
