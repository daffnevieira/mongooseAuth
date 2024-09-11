import mongoose from 'mongoose';

const User = mongoose.model('login', {
    nome: String,
    email: String,
    tel: Number,
    password: String,
    confirmpass: String,

});

export default User;