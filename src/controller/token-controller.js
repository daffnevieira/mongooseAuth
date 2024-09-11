import jwt from 'jsonwebtoken';

export const tokenMiddleware = {
    authCheck: function (req, res, next) {
        const token = req.query.token || (req.headers['authorization'] && req.headers['authorization'].split(" ")[1]);
        if (!token) {
            return res.status(401).json({ msg: "Acesso não permitido" });
        }

        try {
            const secret = process.env.SECRET;
            const decoded = jwt.verify(token, secret);
            req.user = decoded;

            next();

        } catch (err) {
            return res.status(403).json({ msg: "Token inválido" });
        }
    },

    refreshToken: function (req, res, next) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next();
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if (err) {
                return next();
            }

            const accessToken = generateToken(user);
            const newRefreshToken = generateRefreshToken(user);

            res.locals.tokens = { accessToken, refreshToken: newRefreshToken };

            next();
        });
    }
};
