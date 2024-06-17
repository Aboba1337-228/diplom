import jwt from "jsonwebtoken"
import {} from "dotenv/config"

export const generateAccessToken = (id, roleId) => {
    return jwt.sign(
        { id, roleId },
        process.env.SECRET_KEY,
        { expiresIn: '2h' }
    )
}