// direcciones de cada funcion

const express=require('express'); //cargar express con las funciones del framework express
const CustomerController=require('../controllers/customerController')

const api=express.Router(); // permite usar post, put, get, delete...


api.post("/Crear",CustomerController.Create);

api.put('/Acrualizar/:id',CustomerController.Update)

api.delete('/Borrar/:id',CustomerController.Remove)

api.get('/Listar/Todos',CustomerController.GetAllCustomers)

api.get('/Buscar/:correo',CustomerController.SearchCustomer)

api.post('/login',CustomerController.Login)
api.post('/Registro',CustomerController.Registro)

module.exports=api;








