import {Sequelize} from 'sequelize';
import config from '../../config/config.json';

const env = process.env.NODE_ENV || 'development';
const db = {};

export const sequelize = new Sequelize(config.database,config.username,config.password,config);
