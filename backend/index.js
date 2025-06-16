import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import path from "path"

import connectdb from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import genreRoutes from "./routes/genreRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"

dotenv.config()
connectdb()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.PORT || 4000

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/genre', genreRoutes)
app.use('/api/v1/books', bookRoutes)
app.use('/api/v1/uploads', uploadRoutes)

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
