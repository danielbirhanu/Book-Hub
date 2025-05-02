import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import path from "path"

import connectdb from "./config/db.js"

dotenv.config()
connectdb()