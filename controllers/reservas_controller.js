import {body, param, validationResult} from "express-validator"; //dependencia que ayudara a validar lo que el front envie 
import Reservas from "../models/Reservas.js";
import Mesas from "../models/Mesas.js";

//Crear una nueva reserva

  export const crearReserva=async(req, res)=>{
  const { ClienteID, MesaID, FechaHoraReserva, NumeroPersonas, Preferencias, EstadoReserva, Comentarios } = req.body;

  try {
    const reserva = await Reservas.create({
      ClienteID,
      MesaID,
      FechaHoraReserva,
      NumeroPersonas,
      Preferencias,
      EstadoReserva,
      Comentarios,
    });

    await Mesas.update({EstadoMesa: "confirmada"}, {
      where:{
        MesaID
      }
    })
    res.status(201).json({msg:"Reserva exitosa", "Reserva":reserva});
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
}


