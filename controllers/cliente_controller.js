import {body, param, validationResult} from "express-validator"; //dependencia que ayudara a validar lo que el front envie 
import Cliente from "../models/Clientes.js";
import Reservas from "../models/Reservas.js";
import generarJWT from "../helpers/generarJWT.js";
import jwt, { decode } from 'jsonwebtoken';

    //registro
export const registro = async(req, res)=>{
    //seguridad
    //correo
    await body('correo').escape().trim().notEmpty().withMessage('El correo esta vacío').isEmail().withMessage('Introduzca un correo valido').isLength({min:3}).withMessage('El correo debe tener mas de 3 caracteres (letras)').isLength({max:100}).withMessage('El correo demasiado largo, introduzca otro').run(req); //ejecutar validacion
    //nombre
    await body('nombre').escape().trim().notEmpty().withMessage('El nombre esta vacío').isLength({min:3}).withMessage('El nombre debe tener mas de 3 caracteres (letras)').isLength({max:50}).withMessage('El nombre demasiado largo, introduzca otro').run(req); //ejecutar validacion
    //apellido
    await body('apellido').escape().trim().notEmpty().withMessage('El apellido esta vacío').isLength({min:3}).withMessage('El apellido debe tener mas de 3 caracteres (letras)').isLength({max:50}).withMessage('El apellido demasiado largo, introduzca otro').run(req);
    //telefono
    await body('telefono').escape().trim().notEmpty().withMessage('El telefono esta vacío').isLength({min:10}).withMessage('El telefono debe tener mas de 3 caracteres (letras)').isLength({max:10}).withMessage('El apellido demasiado largo, introduzca otro').run(req);
    //contraseña
    await body('contrasena').escape().trim().notEmpty().withMessage('La contraseña esta vacío').isLength({min:6}).withMessage('La contraseña debe tener mas de 6 caracteres (letras)').isLength({max:100}).withMessage('El apellido demasiado largo, introduzca otro').run(req);

    let resultadoValidacion = validationResult(req);
    if(!resultadoValidacion.isEmpty()){
        return res.status(400).json({ errores: resultadoValidacion.array() });
    }

    const {correo,nombre,apellido,telefono,contrasena}=req.body //recuperacion de datos y creo variables 
    const validarCorreo = await Cliente.findOne({
        attributes: ['CorreoElectronico'],
        where: { 
            CorreoElectronico: correo
        }
    })
    if(validarCorreo){
        return res.status(400).json({ 
            errores: [{msg: "El correo ya esta registrado"}] //evitar duplicados
        })
    }

    // Almacenar un usuario
    await Cliente.create({
        Nombre: nombre, 
        Apellido: apellido,
        CorreoElectronico: correo,
        Telefono: telefono,
        Contrasena: contrasena,
    })

    
    res.status(201).json({msg:"Cliente exitoso"})
}
//escape, cambia los caracteres de <> seguridad
//trim, elimina espacios en blanco(inicio y final)
//notempy, verifica que no este vacio
//withmessage, arreglo de errores
//isemail, verifica que sea un correo 


//inicio de sesion------------------------------------------------------------------------------
export const inicio_sesion = async(req, res)=>{
    //correo
    await body('correo').escape().trim().notEmpty().withMessage('El correo esta vacío').isEmail().withMessage('Introduzca un correo valido').isLength({min:3}).withMessage('El correo debe tener mas de 3 caracteres (letras)').isLength({max:100}).withMessage('El correo demasiado largo, introduzca otro').run(req); //escape no me podran inyectar codigo de js
    //contraseña
    await body('contrasena').escape().trim().notEmpty().withMessage('La contraseña no puede ir vacía').isLength({min:6,max:16}).withMessage('La contraseña tiene que tener un mínimo de 6 y máximo de 16 letras').custom(userPassword => { // hacer validacion personalizada

        if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$#!%])(?=.*\d)[A-Za-z\d@$#!%]{6,16}$/.test(userPassword)){
            throw new Error("La contraseña debe tener por lo menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial (@$#!%)")
        }

        return true;
    }).run(req);

    let resultadoValidacion = validationResult(req);
    if(!resultadoValidacion.isEmpty()){
        return res.status(400).json({ errores: resultadoValidacion.array() });
    }

    const {correo, contrasena} = req.body

    const cliente = await Cliente.findOne({
        where: {
            CorreoElectronico: correo
        }
    })

    if(cliente === null){
        return res.status(400).json({ 
            errores: [{msg: "El correo no esta registrado"}]
        })
    }
    
    if(!cliente.verificaPassword(contrasena)){
        return res.status(400).json({ 
            errores: [{msg: "Contraseña incorrecta"}]
        })
    }

    res.status(202).json({msg: "Inicio de sesión exitoso", token: generarJWT(cliente.ClienteID)})
}

export const datosUsuario = async(req, res)=>{
    let token, cliente;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];//separa en dos la cadena y toma la posición 1 del token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            cliente = await Cliente.findOne({
                where: {
                    ClienteID: decoded.id
                }
            })
        } catch (error) {
            const errorToken = new Error('Token no valido');
            return res.status(403).json({msg: errorToken.message, logueado: false}); 
        }
    }

    if(!token){
        const error = new Error('Token no valido o inexistente');
        return res.status(403).json({msg: error.message, logueado: false});
    }
    res.status(202).json({msg: "Inicio de sesión exitoso", cliente, logueado: true})
}