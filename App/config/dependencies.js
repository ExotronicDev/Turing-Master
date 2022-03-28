// General
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require('dotenv');
//const colors = require("colors");

module.exports = {
    express, morgan, path, 
    dotenv, mongoose
}