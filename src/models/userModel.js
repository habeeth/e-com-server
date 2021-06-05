const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 3,
        max: 30
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hash_password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'manager', 'user', 'customer'],
        default: 'user'
    },
    contactNumber: {
        type: String
    },
    profilePicture: {
        type: String
    }
}, { timestamps: true });

//Don’t use arrow functions when you use Mongoose (Schema.method())
//https://medium.com/@lucasdavidferrero/dont-use-arrow-functions-when-you-use-mongoose-schema-method-190b79f1640c
// userSchema.virtual('password')
//     .set((password) => {
//         this.hash_password = bcrypt.hashSync(password, 10);
//     });
userSchema.virtual('password').set(
    function (password) {
        this.hash_password = bcrypt.hashSync(password, 10);
    }
);

userSchema.virtual("fullName").get(
    function () {
        return `${this.firstName} ${this.lastName}`;
    }
);

// userSchema.methods = {
//     authenticate: (password) => {
//         return bcrypt.compareSync(password, this.hash_password);
//     }
// };

userSchema.methods = {
    authenticate: function (password) {
        const result = bcrypt.compareSync(password, this.hash_password);
        // console.log("result",result);
        return result;
    }
}

module.exports = mongoose.model('User', userSchema);;