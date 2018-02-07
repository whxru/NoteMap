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
    for (let note of notelist.notes) {
        // Find and store one single note
        var promise = noteStore.getNoteWithResultSpec(note['guid'], noteSpec).then(nt => {
            for (let attr of ['title', 'content', 'tagGuids', 'tagNames']) {
                if (typeof notes[nt.guid] === 'undefined') {
                    notes[nt.guid] = {};
                }
                notes[nt.guid][attr] = nt[attr];
            }
        });
        // Finish storing the last note
        if(notelist.notes[notelist.notes.length - 1]['guid'] === note['guid']) {
            return promise;
        }
    }
}).then(() => {
    return userStore.getUser();
}).then(user => {
    userId = user['id'];
    shardId = user['shardId'];
    noteGuid = Object.keys(notes)[0];
    inAppLink = `evernote:///view/${userId}/${shardId}/${noteGuid}/${noteGuid}`;
    testNoteContent = `
        <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note><div>In-App Link: <a href="${inAppLink}">岳阳楼记</a></div></en-note>
    `;

    noteStore.createNote(new Evernote.Types.Note({
        title: "NoteLink Test: In-App",
        content: testNoteContent
    })).then(testNote => { console.log(testNote) }).catch(reason => {
        console.log(reason);
    });
})
