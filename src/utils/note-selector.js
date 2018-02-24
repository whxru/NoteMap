const EventEmitter = require('events');
const { ipcRenderer } = require('electron');

class NoteSelector extends EventEmitter{
    constructor(noteTree) {
        super();
        this.element = document.createElement('ul');
        this._list = [];
        this._alive = false;
        this._focusOn = 1;
        
        // Generate note list
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
        // Initialize the element
        var self = this;
        this.element.setAttribute('tabIndex', 1);
        this.element.className = 'note-selector';
        this.element.addEventListener('keydown', evt => {
            if(evt.key === 'ArrowDown') {
                evt.preventDefault();
                // Select next note
                document.querySelector(`.note-selector>li:nth-child(${self._focusOn})`).classList.remove('note-selected');
                self._focusOn = self._focusOn % self._list.length + 1;
                document.querySelector(`.note-selector>li:nth-child(${self._focusOn})`).classList.add('note-selected');
                return;
            }
            
            if(evt.key === 'ArrowUp') {
                evt.preventDefault();
                // Select previous note
                document.querySelector(`.note-selector>li:nth-child(${self._focusOn})`).classList.remove('note-selected');
                self._focusOn = self._focusOn===1 ? self._list.length : self._focusOn-1;
                document.querySelector(`.note-selector>li:nth-child(${self._focusOn})`).classList.add('note-selected');
                return;
            }
            
            if(evt.key === 'Enter' || evt.key === 'Tab') {
                evt.preventDefault();
                // Confirm the selection
                var li = document.querySelector(`.note-selector>li:nth-child(${self._focusOn})`);
                self.emit('selected', li.getAttribute('guid'), li.getAttribute('title'));
                self.removeElement();
                return;
            }

            self.removeElement();
        })
        // Add notes into element
        this._list.forEach((note, idx) => {
            // Basic content
            var li = document.createElement('li');
            li.setAttribute('guid', note.guid);
            li.setAttribute('title', note.title);
            if(idx === 0) li.classList.add('note-selected');
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

        this._alive = true;
    }

    removeElement() {
        this.element.parentNode.removeChild(this.element);
        this._alive = false;
        this.emit('removed');
    }

    isAlive() {
        return this._alive;
    }

    focus() {
        this.element.focus();
    }
}

module.exports = {
    NoteSelector: NoteSelector
}