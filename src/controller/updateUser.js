import User from '../models/User.js';

export async function updateUser(req, res) {

    const { password, newPassword } = req.body;


    if (!password && !newPassword) {
        return res.status(422).json({ msg: "A senha é obrigatória" });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }
        const matchPassForUpdate = await bcrypt.compare(password, user.password);
        if (!matchPassForUpdate) {
            return res.status(422).json({ msg: "Senha incorreta" });
        }
        const hashedNewPass = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashedNewPass }); 
        res.status(200).json({ msg: "Usuário atualizado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Erro interno do servidor" });
    }

}