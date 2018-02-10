const Evernote = require('evernote');

/**
 * Package for common methods of accessing contents in an evernote account.
 * @class EvernoteAccount
 */
class EvernoteAccount {
    /**
     * Creates an instance of EvernoteAccount.
     * @param {Evernote.UserStore} userStore - Manages Evernote user accounts
     * @param {Evernote.NoteStore} noteStore - Manages the contents of a user's evernote account
     * @memberof EvernoteAccount
     */
    constructor(userStore, noteStore) {
        this._userStore = userStore;
        this._noteStore = noteStore;
    }

    /**
     * Get all notes in current account.
     * @example Example of using account.
     * account.getAllNotes().then(notes => {
     *     console.log(notes);
     * })
     * @returns {promise} Promise object reprsents all notes in current account
     * @memberof EvernoteAccount
     */
    getAllNotes() {
        var notes = {};
        var filter = new Evernote.NoteStore.NoteFilter({});
        var noteListSpec = new Evernote.NoteStore.NotesMetadataResultSpec({
            includeTitle: true,
            includeContentLength: true,
            includeNotebookGuid: true
        });
        var noteSpec = new Evernote.NoteStore.NoteResultSpec({
            includeContent: true
        });
        return this._noteStore.findNotesMetadata(filter, 0, 500, noteListSpec).then(notelist => {
            for (let note of notelist.notes) {
                // Find and store one single note
                var promise = this._noteStore.getNoteWithResultSpec(note['guid'], noteSpec).then(nt => {
                    for (let attr of ['title', 'content', 'tagGuids', 'tagNames', 'notebookGuid']) {
                        if (typeof notes[nt.guid] === 'undefined') {
                            notes[nt.guid] = {};
                        }
                        notes[nt.guid][attr] = nt[attr];
                    }
                    return notes;
                });
                // Finish storing the last note
                if (notelist.notes[notelist.notes.length - 1]['guid'] === note['guid']) {
                    return promise;
                }
            }
        })
    }
}

module.exports = {
    EvernoteAccount: EvernoteAccount
}
