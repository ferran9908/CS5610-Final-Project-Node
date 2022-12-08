import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    const { authorization } = req.headers

    if (authorization) {
        const token = await authorization.split(" ")[1]
        if (token) {
            const userInfo = await jwt.verify(token, "CS5610")
            if (userInfo) {
                req.user = userInfo
                next()
            } else {
                return res.status(400).send({ error: "Invalid JWT" })
            }
        } else {
            return res.status(400).send({ error: "Invalid Authorization Header" })
        }
    } else {
        return res.status(400).send({ error: "No Authorization Header Found" })
    }

}

export default isLoggedIn