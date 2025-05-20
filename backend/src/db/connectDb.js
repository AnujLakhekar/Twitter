import mongoose from "mongoose"


const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://anujlakhekar4:wtCwMYPpMOgMG7YE@twitter.opew1lg.mongodb.net/?retryWrites=true&w=majority&appName=Twitter", {
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