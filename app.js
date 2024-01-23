var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/books', booksRouter);

// Swagger docuemntation setup
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
var options = {
    definition: {
        openapi: '3.0.0',
        info: {title: 'Books API', version: '1.0.0'},
        tags: [
            {name: 'Books', description: 'Operations related to books.'}
        ],
    },
    apis: ['./routes/books.js'],
};
var swaggerSpec = swaggerJsDoc(options);


app.use('/', indexRouter);
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/apidocs/books', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec));



module.exports = app;
