const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        email: {
            type:String,
            required: [true, 'email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: [true, 'password is required']
        }
    },
    {
        timestamps: true
    }
);

module.exports = model('User', userSchema)