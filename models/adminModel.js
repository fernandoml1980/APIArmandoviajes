const mongoose=require('mongoose');
const schema=mongoose.Schema

const adminSchema=new schema({ /*datos del documento clientes*/
    usuario:{type:String, required:true, trim:true, unique:true}, /*trim es para limpiar espacios*/
    clave:{type:String, required:true, trim:true},
   
}, {timestamps:true} /* para guardar la fecha de creación y modificacion*/
)
module.exports = mongoose.model('administrador',adminSchema)

 