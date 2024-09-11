import express from 'express';
import { authRegister, authUser } from '../controller/register-auth.js';
import { tokenMiddleware } from '../controller/token-controller.js';
import { findUser } from '../controller/findUser.js'
import { updateUser } from '../controller/updateUser.js'
import { excluirUser } from '../controller/excluirUser.js';
const router = express.Router();

router.use(express.json())

router.post('/auth/cadastro', authRegister) //Cadastro de Usuários

router.post('/auth/login', authUser) //Login

router.post('/auth/refresh', tokenMiddleware.refreshToken) // Atualiza Tokens

router.get('/user/:id', tokenMiddleware.authCheck, findUser) // Encontra algum usuario

router.put('/user/update', tokenMiddleware.authCheck, updateUser) //Atualiza senha

router.delete('/user/excluir', tokenMiddleware.authCheck, excluirUser) //Exclui dados do usuario logado


export default router;