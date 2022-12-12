require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');  // Save user Credentials in Cookies
const cors = require('cors');
const expressValidator = require('express-validator')

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

// app
const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => console.log("DB Connected!"));
// mongoose.connect(process.env.DATABASE, {   // For local MongoDB
//     useNewUrlParser: true,
//     useCreateIndex: true
// }).then(() => console.log("DB Connected!"));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());  //application/json
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);


// Error Handlelling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

// db
const port = process.env.PORT || 8000;
// mongoose.connect(process.env.MONGO_URI)
//     .then(result => {
//         console.log('DB Connected!');
//         app.listen(port, () => {
//             console.log(`Server is running on port ${port}`);
//         });
//     })
//     .catch(err => console.log(err));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});