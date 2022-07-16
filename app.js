const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, err => {
        if (err) throw err;
        console.log('Connected to MongoDB!!!')
    });

    
require('./api/models/product');
require('./api/models/order');
require('./api/models/user');
require('./api/models/peoples');
require('./api/models/address');


const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const peopleRoutes = require('./api/routes/peoples');
const addressRoutes = require('./api/routes/addresses');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


require('./api/config/passport')(passport);
app.use(passport.initialize());

const cors = (req, res, next) => {
    const whitelist = [
        'http://localhost:8080',
        'http://localhost:4200'
    ];
    const origin = req.headers.origin;
    if (whitelist.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'token,Content-Type,Authorization, x-access-token');
    next();
}
app.use(cors);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/peoples', peopleRoutes);
app.use('/addresses', addressRoutes);

let swaggerSpec = require('./api/config/swagger');
app.use('/api-docs', swaggerUi.serve, 
         swaggerUi.setup(swaggerSpec));


app.use('/api', (req, res, next) => {
    res.status(200).json({
        message: 'Hello word!'
    })
})

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;