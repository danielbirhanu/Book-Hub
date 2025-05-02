import mongoose from "mongoose";

const connectdb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database successfully")
    } catch(error){
        console.error(`error: ${error.message}`)
        process.exit(1)
    }
}

export default connectdb