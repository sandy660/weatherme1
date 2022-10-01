const express = require('express');
const axios = require('axios');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

const key = 'a2685f057ae56c537cc59bef85a2e80c';

function handleResponseWeather(response) {
    return response.data
}

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title } = req.body;
    const errors = [];

    // Validate title
    if (!title) {
        errors.push({ text: 'Please enter a city' });
    }

    if (errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title
        });
    } else {
        const newNote = new Note({ title });
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Note added Successfully');
        res.redirect('/notes');
    }

});

router.get('/notes', isAuthenticated, async (req, res) => {
    const notes = await Note.find({ user: req.user.id });
    const ari = {
        notes: notes.map(document => {
            return {
                id: document._id,
                title: document.title
            }
        })
    }

    for (let note of ari.notes) {
        const cityInfo = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + note.title + '&appid=' + key).then(handleResponseWeather).catch(console.error);
        const weatherInfo = await axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + cityInfo.coord.lat + '&lon=' + cityInfo.coord.lon + '&exclude=hourly,minutely&units=metric&appid=' + key).then(handleResponseWeather).catch(console.error);
        note.timeZone = weatherInfo.timezone;
        note.countryCode = cityInfo.sys.country;
        note.imgCode = weatherInfo.current.weather[0].icon;
        note.dayTemp = weatherInfo.daily[0].temp.day;
        note.nightTemp = weatherInfo.daily[0].temp.night;
    }
    res.render('notes/all-notes', { notes: ari.notes })
});


router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note delete successfully');
    res.redirect('/notes');
});

module.exports = router;