import User from '../models/User.js';

export const findUser = async function(req, res) {

    const id = req.params.id

    const user = await User.findById(id, '-password')

    if(!user) {
        return res.status(404).json({msg: "Usuario não encontrado"})
    }
    res.status(200).json({ user })

};
