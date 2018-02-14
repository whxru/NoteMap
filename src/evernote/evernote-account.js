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
        return this._userStore.getUser().then(user => {
            var uid = user.id;
            var shardId = user.shardId;
            return this._noteStore.findNotesMetadata(filter, 0, 500, noteListSpec).then(notelist => {
                if(notelist.notes.length <= 0) return;
                var index = 0;
                var promise = Promise.resolve(notes);
                
                // Get every note's content in a "promise chain"
                do {
                    let idx = index; // Instant number in closure
                    promise = promise.then(notes => {
                        var note = notelist.notes[idx];
                        return this._noteStore.getNoteWithResultSpec(note['guid'], noteSpec).then(nt => {
                            for (let attr of ['title', 'content', 'tagGuids', 'tagNames', 'notebookGuid']) {
                                if (typeof notes[nt.guid] === 'undefined') {
                                    notes[nt.guid] = {};
                                }
                                notes[nt.guid][attr] = nt[attr];
                            }
                            notes[nt.guid]['link'] = EvernoteAccount.inAppLink(nt.guid, uid, shardId);
                            return notes;
                        });
                    });
                } while (index++ < notelist.notes.length - 1);
                
                return promise;
            })
        })
    }


    /**
     * Get notes in a form of tree.
     * @returns {promise} Promise object reprsents the relationships among notebooks and notes .
     * @memberof EvernoteAccount
     */
    getNoteTree() {
        var noteTree = {};
        return this._noteStore.listNotebooks().then(notebooks => {
            for (let notebook of notebooks) {
                noteTree[notebook.name] = {
                    guid: notebook.guid,
                    notes: {}
                };
            }

            var index = 0;
            var promise = Promise.resolve(noteTree);

            do {
                let idx = index;
                promise = promise.then(noteTree => {
                    var noteFilter = new Evernote.NoteStore.NoteFilter({
                        notebookGuid: notebooks[idx].guid
                    });
                    var spec = new Evernote.NoteStore.NotesMetadataResultSpec({
                        includeTitle: true,
                        includeNotebookGuid: true
                    });
                    // Get notes in a notebook
                    return this._noteStore.findNotesMetadata(noteFilter, 0, 250, spec).then(notesMetadataList => {
                        for (let note of notesMetadataList.notes) {
                            noteTree[notebooks[idx].name].notes[note.title] = {
                                guid: note.guid
                            }
                        }
                        return noteTree;
                    });
                });
            } while (index++ < notebooks.length - 1)

            return promise;
        })
    }
    /**
     * Get noteStore
     * @returns {Evernote.NoteStore} The noteStore of current account.
     * @memberof EvernoteAccount
     */
    getNoteStore() {
        return this._noteStore;
    }

    /**
     * Get userStore
     * @returns {Evernote.UserStore} The userStore of current account
     * @memberof EvernoteAccount
     */
    getUserStore() {
        return this._userStore;
    }

    static inAppLink(noteGuid, uid, shardId) {
        return `evernote:///view/${uid}/${shardId}/${noteGuid}/${noteGuid}/`;
    }

}

module.exports = {
    EvernoteAccount: EvernoteAccount
}
