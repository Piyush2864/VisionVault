import mongoose from 'mongoose';


const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/userAuthorization"

const connectToDb = () => {
    mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 30000
    }).then(() => {
        console.log("Successfully connected to MongoDB")
    }).catch(err => console.error("Error connecting to MongoDB"));
};

export default connectToDb;