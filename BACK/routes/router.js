import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

router.use(express.json())

router.post('/auth/cadastro', async (req, res) => {
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

})
router.post('/auth/login', async (req, res) => {

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

        res.status(200).json({ token })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            msg: "Um erro ocorreu"
        }) 
    }
    
})

router.post('/auth/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ msg: 'Refresh token necessário' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: 'Refresh token inválido' });
        }

        // Gerar novo token de acesso
        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({ accessToken, refreshToken });
    });
});

router.get('/usuario/:id', checkToken, async (req, res) => {

    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: "Usuario não encontrado"})
    }
    res.status(200).json({ user })
})

function checkToken(req, res, next){
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(" ")[1]

    if(!token){
        return res.status(501).json({msg : "Acesso não permitido"})
    }

    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)

        next()

    } catch(err) {
        res.status(500).json({msg: "Token Invalido"})
    }
}


router.delete('/auth/excluir/:id', async (req, res) => {
    const id = req.params.id

    try{
        const user = await User.findById(id)
        if(!user) {
            return res.status(404).json({msg: "Envie seu ID"})
        }

        const matchPassForDelete = await bcrypt.compare(password, user.password)
        if(!matchPassForDelete) {
            return res.status(422).json({ msg: "A senha é obrigatória" });
        }
        await User.findByIdAndDelete(id)
        res.status(200).json({msg: "Usuário excluído"})
    }
    catch (err) {
        res.send(err)
    }
})
router.delete('/login/excluir', checkToken, async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        const matchPassForDelete = await bcrypt.compare(password, user.password);
        if (!matchPassForDelete) {
            return res.status(422).json({ msg: "Senha incorreta" });
        }

        await User.findByIdAndDelete(req.user.id); 
        res.status(200).json({ msg: "Usuário excluído com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }
});

router.put('/auth/mudarsenha', async (req, res) => {

})

export default router;