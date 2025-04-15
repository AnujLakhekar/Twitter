import mongoose from "mongoose"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    
    console.log(conn.connection.host
)
  } catch (e) {
    console.log("error" + e.message)
  }
  
}


export default connectDB