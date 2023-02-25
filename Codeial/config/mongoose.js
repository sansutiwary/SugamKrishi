const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SugamKrishi');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Some error happend while connecting to DataBase"));
db.once('open',function(){
    console.log('Successfully connected to Database');
});