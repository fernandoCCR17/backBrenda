import express from "express"
import dotenv from "dotenv"
import cliente_rutas from "./routes/clientes_rutas.js";
import db from "./config/db.js";
import helmet from "helmet"; //modifica cabeceras
import cors from "cors";

const app = express();
app.use(helmet());

// Habilitar lectura de datos de formularios
app.use(express.json());

dotenv.config();

//conexion a front
const dominiosPermitidos = [process.env.DOMINIO];
const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            callback(new Error("No permitido por CORS"))
        }
    },
}

app.use(cors(corsOptions)) //seguridad(especificar que rutas estan permitidas para hacer llamados)

app.use("/auth", cliente_rutas)

// conexion a la base de datos
try{
    await db.authenticate();
    db.sync();
    console.log('Conexion exitosa a la base de datos');
}catch(error){
    console.log(error);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en la ruta http://localhost:${PORT}`)
})
