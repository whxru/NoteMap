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
        this._noteTree = null;
    }


    static inAppLink(noteGuid, uid, shardId) {
        return `evernote:///view/${uid}/${shardId}/${noteGuid}/${noteGuid}/`;
    }
    
    /**
     * Get all notes in current account.
     * @example Example of using account.
     * account.getAllNotes().then(notes => {
     *     console.log(notes);
     * })
     * @param {boolean} [useCache=true] - Use cached note-tree or not
     * @returns {promise} Promise object reprsents all notes in current account
     * @memberof EvernoteAccount
     */
    getAllNotes(useCache=true) {
        return this.getNoteTree(useCache).then(noteTree => {
            var notelist = {};
            // noteTree -> list of notes
             Object.keys(noteTree).forEach(notebookName => {
                 Object.keys(noteTree[notebookName].notes).forEach(noteGuid => {
                     var noteAttrs = {},
                         note = noteTree[notebookName].notes[noteGuid];
                     for (let attr of ['title', 'content', 'tagGuids', 'tagNames', 'notebookGuid', 'link']) {
                        noteAttrs[attr] = note[attr];
                     }
                     notelist[noteGuid] = noteAttrs;
                 })
             })
             return notelist;
        }).catch(reason => { console.log(reason); });
    }


    /**
     * Get notes in a form of tree.
     * @param {boolean} [useCache=true] - Use cached note-tree or not
     * @returns {promise} Promise object reprsents the relationships among notebooks and notes
     * @memberof EvernoteAccount
     */
    getNoteTree(useCache=true) {
        if (!useCache || this._noteTree === null) {
            return this._fetchNoteTree().then(noteTree => {
                this._noteTree = noteTree;
                return noteTree;
            })
        } else {
            return Promise.resolve(this._noteTree);
        }
    }

    /**
     * Get user of this account.
     * @param {boolean} [useCache=true] - Use cached data or not
     * @returns {promise} Promise object represents the object of user
     * @memberof EvernoteAccount
     */
    getUser(useCache=true) {
        if (!useCache || this._user === null) {
            return this._fetchUser().then(user => {
                this._user = user;
                return user;
            })
        } else {
            return Promise.resolve(this._user);
        }
    }
    
    /**
     * Create a note.
     * @param {string} title - Title of the note
     * @param {string} content - Content of the note
     * @param {Evernote.Types.Resources} resources - Object of attachments
     * @param {string} [notebookGuid=null] - The unique identifier of the notebook that contains this note
     * @returns {promise} Promise object represents the note created
     * @memberof EvernoteAccount
     */
    createNote(title, content, resources, notebookGuid = null) {
        return this._noteStore.createNote(new Evernote.Types.Note({
            title: title,
            content: content,
            resources: resources,
            notebookGuid: notebookGuid
        }));
    }

    /**
     * Get the in-app-link of a note.
     * @param {string} noteGuid - Uniduqe identifier of the note
     * @returns {promise} Promise object represents the in-app-link
     */
    getInAppLink(noteGuid) {
        return this.getUser().then(user => EvernoteAccount.inAppLink(noteGuid, user.id, user.shardId));
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

    /**
     * Update the note-tree by fetching notes from the server.
     * @returns {promise} Promise object represents the note-tree
     * @memberof EvernoteAccount
     */
    _fetchNoteTree() {
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
                        return this._getNotesInList(notesMetadataList.notes).then(notes => {
                            for (let note of notes) {
                                noteTree[notebooks[idx].name].notes[note.guid] = {
                                    title: note.title,
                                    content: note.content,
                                    tagGuids: note.tagGuids,
                                    tagNames: note.tagNames,
                                    notebookGuid: note.notebookGuid,
                                    link: note.link,
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
        }).then(noteTree => {
            this._noteTree = noteTree;
            return noteTree;
        });
    }

    /**
     * Update user from the server.
     * @returns {promise} Promise object represents the user
     * @memberof EvernoteAccount
     */
    _fetchUser() {
        return this._userStore.getUser().then(user => {
            this._user = user;
            return user;
        })
    }

    /**
     * Get every note's detail in a list of note.
     * @param {array} notelist - Array of note object
     * @returns Array of notes
     * @memberof EvernoteAccount
     */
    _getNotesInList(notelist) {
        return this.getUser().then(user => {
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
                        newNote['link'] = EvernoteAccount.inAppLink(nt.guid, user.id, user.shardId);
                        notes.push(newNote);
                        return notes;
                    });
                });
            } while (index++ < notelist.length - 1);
            
            promise.catch(reason => { console.error(reason); })
            return promise;
        })
    }

}

module.exports = {
    EvernoteAccount: EvernoteAccount
}
