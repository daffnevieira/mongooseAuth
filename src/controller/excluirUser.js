import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const excluirUser = async function (req, res) {
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
};
