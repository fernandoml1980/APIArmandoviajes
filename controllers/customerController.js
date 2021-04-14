//funciones para interactuar con la base de datos

const Clientes = require('../models/customerModel');
const nodemailer = require('nodemailer');


//req->son los para,etros que se reciben
//res->respuesta

function Create(req, res) { //cargar los atributos del objeto con los datos
     //variables para enviar en el correo
    var nombres =req.body.nombres
    var correo = req.body.correo;
    var telefono= req.body.telefono;

    //objeto para guardar los datos en las bariables
    const cliente = new Clientes({
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        telefono: req.body.telefono,
        correo: req.body.correo,
        ciudad_origen: req.body.ciudad_origen,
        ciudad_destino: req.body.ciudad_destino,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        cantidad_pasajeros: req.body.cantidad_pasajeros,
        tipo_servicio: req.body.tipo_servicio
    })


    //enviar los datos a la base de datos
    cliente.save((error, customerCreated) => {

        if (error) {
            res.status(500).send({ //500 error en el servidor
                statusCode: 500,
                message: "error en el Servidor",
                message: console.log(error)
            })
        } else {
            if (!customerCreated) {
                res.status(400).send({
                    statusCode: 400,
                    message: 'Error al Enviar'
                })
            } else {
                res.status(200).send({
                    statusCode: 200,
                    message: 'Datos Enviados con exito a db',
                    dataUser: customerCreated
                })
            }
        }
    })

    // enviar correo de confirmacion
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fernandoml1980@gmail.com',
            pass: 'enjxfnnnivsjueyg' // Contraseñas de aplicaciones
        }
    });

    const mailOptions = {
        from: 'fernandoml1980@gmail.com ',
        to: 'fernandoml1980@hotmail.com', 
        subject: 'Nueva Solicitud Armandoviajes',
        html:
            'Nueva Solicitud de : <br>Nombres:  '+ nombres+ '<br>Telefono: '+ telefono+'<br>Correo:  '+correo
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}

function Update(req, res) {
    var parameters = req.body;
    var id = req.params.id;
    Clientes.findByIdAndUpdate(id, parameters, (error, customerUpdate) => {
        if (error) {
            res.status(500).send({
                statusCode: 500,
                message: 'Error en el Servidor'
            })
        } else {
            if (!customerUpdate) {
                res.status(400).send({
                    statusCode: 400,
                    message: 'Error al Actualizar'
                })
            }
            else {
                res.status(200).send({
                    statusCode: 200,
                    message: 'Cliente Actualizado'
                })
            }
        }

    })
}

function Remove(req, res) {
    var id = req.params.id;

    Clientes.findByIdAndDelete(id, (error, userDeleted) => {
        if (error) {
            res.status(500).send({
                statusCode: 500,
                message: 'Error en el Servidor'
            })
        } else {
            if (!userDeleted) {
                res.status(400).send({
                    statusCode: 400,
                    message: 'Error al Eliminar'
                })
            } else {
                res.status(200).send({
                    statusCode: 200,
                    message: id + ' Eliminado'
                })
            }
        }

    })
}

function GetAllCustomers(req, res) {
    Clientes.find({}, (error, allCustomers) => {
        if (error) {
            res.status(500).send({
                statusCode: 500,
                message: 'Error en el Servidor'
            })
        } else {
            if (!allCustomers) {
                res.status(400).send({
                    statusCode: 400,
                    message: 'Error al listar los Clientes'
                })
            } else {
                res.status(200).send({
                    statusCode: 200,
                    message: 'Clientes',
                    AllCustomers: allCustomers
                })
            }
        }
    })
}

function SearchCustomer(req, res) {
    var mail = req.params.correo;
    Clientes.find({ correo: mail }, (error, Customer) => {
        if (error) {
            res.status(500).send({
                statusCode: 500,
                message: 'Error en el Servidor'
            })
        } else {
            if (!Customer) {
                res.status(400).send({
                    statusCode: 400,
                    message: 'Error al listar los Clientes'
                })
            } else {
                res.status(200).send({
                    statusCode: 200,
                    message: 'Cliente',
                    customer: Customer
                })
            }
        }
    })
}



module.exports = { Create, Update, Remove, GetAllCustomers, SearchCustomer }
