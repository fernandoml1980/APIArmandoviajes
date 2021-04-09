// conector entre las rutas e index,js

const express = require('express'); // framework express
const bodyParser=require('body-parser'); // recibe los datos que se envian a la api y los analiza para enviarlos a la aplicación en su formato
const routes=require('./routes/customerRoute'); // importar la ruta creada
const cors=require('cors') /*para que el front end pueda acceder a las funciones de la API */

const app=express();// app queda cargada con los metodos de express

app.use(bodyParser.json()); // todo lo que pasa por app se convienrte en js
app.use(cors());
app.use('/Clientes',routes);// ruta principal para acceder a las otras funciones

module.exports=app; // exportar app como modulo para usar sus funciones en todo el proyecto

