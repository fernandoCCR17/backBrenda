import express from 'express'
import { registro, inicio_sesion, datosUsuario} from '../controllers/cliente_controller.js';
import { crearReserva } from '../controllers/reservas_controller.js';
const router = express.Router(); //genera el router de la pag (controlador)

// Routing
router.post("/registro", registro);
router.post("/inicio_sesion", inicio_sesion);
router.post("/crearReserva", crearReserva);
router.get("/datos_usuario/:token", datosUsuario)
  export default router;

  //congelar las peticiones por 3 segundos (SEGURIDAD)
  //midelware (iniciar sesion)