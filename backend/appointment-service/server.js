const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = 8080
const app = express();
app.use(cors());
app.use(express.json());

const sessions = require('./routes/SessionRoutes')
const doctors = require('./routes/DoctorRoutes');

app.use('/api/Doctors',doctors);
app.use('/api/Sessions',sessions);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.listen(PORT,()=>{

    console.log(`App Listens To The Port ${PORT}`);
});


