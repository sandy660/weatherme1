const mongoose = require('mongoose');
mongoose.connect(process.env.noteappdb || 'mongodb://localhost/notes-app-db')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));