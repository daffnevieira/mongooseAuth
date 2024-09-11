import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authRegister = async (req, res) => {
    const {name, email, tel, password, confirmpass} = req.body;
    //validação do body
    if(!name || !email || !password || !confirmpass) {
        return res.status(422).json({msg: "O nome é obrigatorio"})
    }
    
    if (password !== confirmpass) {
        return res.status(400).json({ msg: "As senhas não correspondem" });
    }
    //se o usuario existe
    const usuarioexiste = await User.findOne({email: email})
    
    if(usuarioexiste) {
        return res.status(400).json({msg: "Usuario já existe, use outro email"})
    }
    //criar senha

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //criar usuario

    const user = new User({
        name,
        email,
        tel,
        password: passwordHash
    })
    try{
        await user.save()

        res.status(201).json({msg: "usuario salvo com sucesso!"})

    } catch(err) {
        res.status(500).json({msg: "Houve um erro"})
    }
};

export const authUser = async (req, res) => {

    const {email, password} = req.body

    if(!email || !password) {
        return res.status(422).json({msg: "email é obrigatorio e a senha"})
    }

    const usuario = await User.findOne({email: email})
    if(!usuario) {
        return res.status(404).json({msg: "Usuário não registrado"})
    }
    const senhaLogin = await bcrypt.compare(password, usuario.password)
    if(!senhaLogin) {
        return res.status(422).json({msg: "Senha Incorreta"})
    }

    try{
        const secret = process.env.SECRET
        const token = jwt.sign({
            id: usuario._id,

        }, secret)

        res.status(200).json({ token });
       
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            msg: "Um erro ocorreu"
        }) 
    }
    
}
