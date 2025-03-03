module.exports = {
    'secretKey': process.env.SECRET_KEY,
    'mongoUrl':  process.env.MONGO_URL || 'mongodb://localhost:27017/conFusion'
}