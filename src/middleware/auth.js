const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req) => {
    try {
        let requestUserToken= req
        const decoded = jwt.verify(requestUserToken, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': requestUserToken })
        if (!user) {
            return null
        }
       return user
    } catch (e) {
       return e
    }
}

module.exports = auth