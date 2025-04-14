import mongoose from "mongoose"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(conn.connection.host
)
  } catch (e) {
    console.log("error" + e.message)
  }
  
}


export default connectDB