import {DataTypes} from 'sequelize';
import db from '../config/db.js';

    const Mesas = db.define('Mesas', {
        MesaID: {
            type: DataTypes.INTEGER, 
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        NumeroMesa: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Capacidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        EstadoMesa: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

export default Mesas;