const express = require('express');
const env = require('dotenv');
const app = express();
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/adminAuth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const path = require('path');
const cors = require('cors');

//Dev dependency env variable will be loaded during development
env.config();

// mongo connection string - "3.6 or later" is not working - "2.2.12 or later" is working
//https://stackoverflow.com/questions/55499175/how-to-fix-error-querysrv-erefused-when-connecting-to-mongodb-atlas
// `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.qyxww.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;
const uri = `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0-shard-00-00.qyxww.mongodb.net:27017,cluster0-shard-00-01.qyxww.mongodb.net:27017,cluster0-shard-00-02.qyxww.mongodb.net:27017/${process.env.MONGO_DB_DATABASE}?ssl=true&replicaSet=atlas-8f4o7o-shard-0&authSource=admin&retryWrites=true&w=majority`;
console.log("Mongo connection URI", uri);
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Remote MongoDB connection Successfull...");
}).catch(() => {
    console.log("Remote MongoDB connection Failed...");
});;

app.use(express.json());
// app.use(bodyParser.json());

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);

// app.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: "Default response"
//     });
// });

// app.post('/post', (req, res, next) => {
//     res.status(200).json({
//         message: req.body
//     });
// });

app.listen(process.env.PORT, () => {
    console.log('Server started at port...', process.env.PORT);
});