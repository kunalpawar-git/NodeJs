import mongoose from "mongoose";
export async function connectDB() {

  try {
    
    const mongoUrl = process.env.MONGO_URL;

    await mongoose.connect(
      mongoUrl,
      {
        useNewUrlParser: true
      }
    );
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("mongodb connection error:", err.message);
    // process.exit(1);
  }
}
