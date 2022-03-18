"use strict"
var mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"fill username"]
    },
    email:{
        type:String,
        required:[true,"fill email"]
    },
    password:{
        type:String,
        required:[true,"fill password"]
    }
})

var user = mongoose.model('user',userSchema)
module.exports = user