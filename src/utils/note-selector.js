const EventEmitter = require('events');
const { ipcRenderer } = require('electron');

class NoteSelector extends EventEmitter{
    constructor(noteTree) {
        super();
        this.element = document.createElement('ul');
        this._list = [];

        // Init note list
        Object.keys(noteTree).forEach(notebookName => {
            var notes = noteTree[notebookName].notes;
            Object.keys(notes).forEach(noteGuid => {
                this._list.push({
                    title: notes[noteGuid].title,
                    path: `${notebookName}/${notes[noteGuid].title}`,
                    abstract: notes[noteGuid].abstract,
                    guid: noteGuid 
                })
            });
        });
        // Add notes into element
        this._list.forEach(note => {
            // Basic content
            var li = document.createElement('li');
            li.setAttribute('guid', note.guid);
            li.setAttribute('title', note.title);
            var path = document.createElement('span');
            path.innerText = note.path;
            path.className = 'note-selector-path';
            var abstract = document.createElement('span');
            abstract.innerText = note.abstract;
            abstract.className = 'note-selector-abstract';
            li.appendChild(path);
            li.appendChild(abstract);
            this.element.appendChild(li);
            // On selected
            var self = this;
            li.addEventListener('click', evt => {
                evt.preventDefault();
                self.emit('selected', li.getAttribute('guid'), li.getAttribute('title'));
                self.removeElement();
            })
        })
    }

    removeElement() {
        this.element.parentNode.removeChild(this.element);
    }
}

module.exports = {
    NoteSelector: NoteSelector
}