const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3005;
const path = require('path');

//CONFIGURACION CORS
const frontUrlDes = '';
const localURL = ''
const whitelist = [frontUrlDes, localURL];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
            callback(null, true);
        } else {
            console.log('Origen bloqueado por CORS:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

//Multer
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Swagger Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//ROUTES
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/user', require('./routes/user.routes'));
app.use('/api/v1/manager', require('./routes/manager.routes'))
app.use('/api/v1/asesor', require('./routes/asesor.routes'))
app.use('/api/v1', require('./routes/reporte.routes'));

//LISTENERS
app.listen(port, ()=>{
    console.log(`Servidor activo en el puerto ${port} :)`);
})
