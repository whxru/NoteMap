const Evernote = require('evernote');
const { abstract } = require('./note-abstract');

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
        this._user = null;
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
                        return this.getNotesInList(notesMetadataList.notes).then(notes => {
                            for (let note of notes) {
                                noteTree[notebooks[idx].name].notes[note.guid] = {
                                    title: note.title,
                                    content: note.content,
                                    abstract: abstract(note.content)
                                }
                            }
                            return noteTree;
                        });
                    });
                });
            } while (index++ < notebooks.length - 1)

            promise.catch(reason => { console.error(reason); })
            return promise;
        })
    }

    getNotesInList(notelist) {
        var notes = [];
        var promise = Promise.resolve(notes);
        if (notelist.length <= 0) return promise;
        
        var index = 0;
        var noteSpec = new Evernote.NoteStore.NoteResultSpec({
            includeContent: true
        });
        
        // Get every note's content in a "promise chain"
        do {
            let idx = index; // Instant number in closure
            promise = promise.then(notes => {
                var note = notelist[idx];
                return this._noteStore.getNoteWithResultSpec(note.guid, noteSpec).then(nt => {
                    var newNote = {};
                    for (let attr of ['guid', 'title', 'content', 'tagGuids', 'tagNames', 'notebookGuid']) {
                        newNote[attr] = nt[attr];
                    }
                    // newNote['link'] = EvernoteAccount.inAppLink(nt.guid, uid, shardId);
                    notes.push(newNote);
                    return notes;
                });
            });
        } while (index++ < notelist.length - 1);

        promise.catch(reason => { console.error(reason); })
        return promise;
    }

    /**
     * Create a note.
     * @param {string} title - Title of the note
     * @param {string} content - Content of the note
     * @param {string} [notebookGuid=null] - The unique identifier of the notebook that contains this note
     * @returns {promise} Promise object represents the note created
     * @memberof EvernoteAccount
     */
    createNote(title, content, notebookGuid=null) {
        return this._noteStore.createNote(new Evernote.Types.Note({
            title: title,
            content: content,
            notebookGuid: notebookGuid
        }));
    }

    /**
     * Get the in-app-link of a note.
     * @param {string} noteGuid - Uniduqe identifier of the note
     * @returns {promise} Promise represents the in-app-link
     */
    getInAppLink(noteGuid) {
        if(this._user) {
            return Promise.resolve(EvernoteAccount.inAppLink(noteGuid, this._user.id, this._user.shardId));
        }

        return this._userStore.getUser().then(user => {
            this._user = user;
            return EvernoteAccount.inAppLink(noteGuid, user.id, user.shardId);
        });
    }

    /**
     * Get noteStore.
     * @returns {Evernote.NoteStore} The noteStore of current account.
     * @memberof EvernoteAccount
     */
    getNoteStore() {
        return this._noteStore;
    }

    /**
     * Get userStore.
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
