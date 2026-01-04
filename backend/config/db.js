import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are no longer needed in Mongoose 8
    })

    console.log(`MongoDB Connected successfully@`)

    // Initialize database performance optimizations after connection
    // This will run after models are loaded through route imports
    // setTimeout(async () => {
    //   try {
    //     const { initializeDatabaseOptimizations } = await import(
    //       "../utils/databaseOptimization.js"
    //     )
    //     await initializeDatabaseOptimizations()
    //   } catch (optimizationError) {
    //     console.warn(
    //       "⚠️  Database optimization failed:",
    //       optimizationError.message
    //     )
    //     // console.warn("Application will continue to run normally")
    //   }
    // }, 2000) // Wait 2 seconds for models to be imported

    return conn
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB