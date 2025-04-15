import mongoose from "mongoose"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://Twitter-database:anujanuj25@cluster0.eadtsgk.mongodb.net/?retryWrites=true&w=majority&appName=cluster0", {
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