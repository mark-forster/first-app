const bcrypt = require('bcrypt');

const hashData = async (data, genSalt=10) => {
    try {
        const hashPassword = await bcrypt.hash(data, genSalt);
        return hashPassword;
    } catch (error) {
        res.json({ status: error.status, message: error.message });
    }
};

const verifyHashedData = async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        res.json({ status: error.status, message: error.message });
    }
};

module.exports = { hashData, verifyHashedData };