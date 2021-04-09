//esquema de como van a ser los datos que seenviaran a la base de datos
const mongoose=require('mongoose')

const customerSchema=new mongoose.Schema({ /*datos del documento clientes*/
    nombres:{type:String, required:true},
    apellidos:{type:String, required:true},
    telefono:{type:Number, required:true},
    correo:{type:String, required:true },
    ciudad_origen:{type:String, required:true},
    ciudad_destino:{type:String, required:true},
    fecha_inicio:{type:String, required:true},
    fecha_fin:{type:String, required:true},
    cantidad_pasajeros:{type:Number, required:true},
    tipo_servicio:{type:String, required:true}
})

module.exports=mongoose.model('clientes',customerSchema) //cliente es el nombre como se puede ver la funcion en todo el proyecto