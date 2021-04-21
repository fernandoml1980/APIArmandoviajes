//funciones para interactuar con la base de datos

const Clientes = require('../models/customerModel');
const Admin = require('../models/adminModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SecretKey = 'secretkey123456';

//req->son los para,etros que se reciben
//res->respuesta

function Create(req, res) { //cargar los atributos del objeto con los datos
    //variables para enviar en el correo
    var nombres = req.body.nombres
    var correo = req.body.correo;
    var telefono = req.body.telefono;

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
                }

                )

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
                        'Nueva Solicitud de : <br>Nombres:  ' + nombres + '<br>Telefono: ' + telefono + '<br>Correo:  ' + correo
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err)
                        console.log(err)
                    else
                        console.log(info);
                });
            }
        }
    })


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
                    message: 'Algo salio Mal'
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
                    message: 'Algo salio Mal'
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

function Login(req, res, next) {
    const datos = {
        usuario: req.body.usuario,
        clave: req.body.clave
    }

    // console.log(datos.usuario, '/',datos.clave); //pruebas

    Admin.findOne({ usuario: datos.usuario }, (error, user) => {
        if (error) {
            res.status(500).send({
                statusCode: 500,
                message: 'error en el servidor'
            })
        } else {
            if (!user) { //usuario mal

                res.status(400).send({
                    statusCode: 400,
                    message: 'Algo salio mal usuario :(',
                });
            } else {
                const resultPassword = bcrypt.compareSync(datos.clave, user.clave); //compara la clave enviada por el forn con la encriptada de la bd
                if (resultPassword) {
                    const expiresIn = 24 * 60 * 60;
                    const accesstoken = jwt.sign({ id: user.id }, SecretKey, { expiresIn: expiresIn });

                    const dataUser = {
                        usuario: user.usuario,
                        accesstoken: accesstoken,
                        expiresIn: expiresIn
                    }
                    res.send({ dataUser });
                } else { //password mal
                    res.status(400).send({
                        statusCode: 400,
                        message: 'Algo salio mal :(',
                    });
                }

            }
        }
    })

}

//registr usiario administrador
function Registro(req, res, next) {
    const nuevoRegistro = new Admin({
        usuario: req.body.usuario,
        clave: bcrypt.hashSync(req.body.clave) //encripta la contraseña
    })

    nuevoRegistro.save((error, registro) => {

        if (error && error.code === 11000) {
            return res.status(400).send({
                message: 'el usuario ya existe'
            })
        }

        if (error) {

            return res.status(500).send({
                statusCode: 500,
                message: 'Error en el Servidor',

            }
            )


        } else {
            if (!registro) {
                return res.status(400).send({
                    statusCode: 400,
                    message: 'Algo salio Mal :('
                })
            } else {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: registro.id },
                    SecretKey, {
                    expiresIn: expiresIn

                });

                const dataUser = {
                    usuario: registro.usuario,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }

                res.send({ dataUser })

            }
        }
    })
}



module.exports = { Create, Update, Remove, GetAllCustomers, SearchCustomer, Login, Registro }
