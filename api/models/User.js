const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const UserSchema = new Scheme({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['Man', 'Woman', 'Non-binary/non-conforming', 'Other', 'N/A'],
        default: 'N/A'
    },
    ethnicity: {
        type: [String],
        enum: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Native Hawaiian or Other Pacific Islander', 'White', 'Other'],
        default: ['Other']
    },
    height: {
        type: Number,
        default: 0
    },
    waist: {
        type: Number,
        default: 0
    },
    hip: {
        type: Number,
        default: 0
    },
    chest: {
        type: Number,
        default: 0
    },
    eyes: {
        type: String,
        enum: ['Brown', 'Blue', 'Hazel', 'Green', 'Gray', 'Black', 'Red', 'Amber', 'Other'],
        default: 'Other'
    },
    shoe: {
        type: Number,
        default: 0
    },
    hair: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
},
{
    timestamps: true
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;