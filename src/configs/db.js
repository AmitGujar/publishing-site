const mongoose = require('mongoose');

//Database connection

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`Connected to Database = ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;