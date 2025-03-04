import mongoose from "mongoose";
const ConnectDB = async () => {
  const URI = process.env.MONGO_URI;
  if (!URI) {
    console.error("Connection url not provided");
    return;
  }
  try {
    const connected = await mongoose.connect(URI,{
    
    });
    console.log(`connected to mongodb ${connected.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

export default ConnectDB;
