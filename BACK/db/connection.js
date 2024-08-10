import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const conexao = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(conexao, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
}).then(() => {
    console.log("Banco de dadoS conectado")
})
.catch(err => {
    console.log("Não conectado", err)
})

const db = mongoose.connection;
export default db;
