 const mongoose = require ('mongoose'); // para interactuar con mongo
const app=require('./app'); //importa todas las funciones configuradas en app

 const port = 3000;// puerto de la Api

 mongoose.connect('mongodb://localhost:27017/clientes',{useNewUrlParser:true, useUnifiedTopology:true},
 (error,res)=>{
     if (error){
         console.log('error de conexion: ',error)
     }else{
         console.log('conectado');
         app.listen(port,()=>{
             console.log('escuchando puerto: ',port)
         });
     }
 })// conexion a la base de datos