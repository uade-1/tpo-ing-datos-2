import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://admin:yx05%21%235YV%21CZQ0s0@localhost:27018/eduscale?authSource=admin";

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
