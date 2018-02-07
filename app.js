const Evernote = require('Evernote');
var developerToken = require('./config.json').developerToken;

let notes = {};


// Set up the NoteStore client 
var client = new Evernote.Client({ token: developerToken });
var noteStore = client.getNoteStore();
var userStore = client.getUserStore();

// Store all notes (when number of notes <= 500)
var filter = new Evernote.NoteStore.NoteFilter({});
var noteListSpec = new Evernote.NoteStore.NotesMetadataResultSpec({
    includeTitle: true,
    includeContentLength: true,
    includeNotebookGuid: true
});
var noteSpec = new Evernote.NoteStore.NoteResultSpec({
    includeContent: true
});
noteStore.findNotesMetadata(filter, 0, 500, noteListSpec).then(notelist => {
    notelist.notes.forEach(note => {
        var guid = note['guid'];
        noteStore.getNoteWithResultSpec(guid, noteSpec).then(nt => {
            // Store the note by guid
            ['title', 'content', 'tagGuids', 'tagNames'].forEach(attr => {
                if (typeof notes[nt.guid] === 'undefined') {
                    notes[nt.guid] = {};
                }
                notes[nt.guid][attr] = nt[attr];
            });
        }).then(() => { console.log(notes) });
    });
})