const Evernote = require('Evernote');
var developerToken = require('./config.json').developerToken;

var client = new Evernote.Client({ token: developerToken });

// Set up the NoteStore client 
var noteStore = client.getNoteStore();

// List notebooks
noteStore.listNotebooks().then(function (notebooks) {
    for (var i in notebooks) {
        console.log("Notebook: " + notebooks[i].name);
    }
});