var addButton = document.getElementsByClassName('note-add')[0]
var noteId;
var maxZIndex;
var movingNote;

function createNote(noteStatus) {
    var note = document.createElement('div');
    note.classList.add('note');
    note.setAttribute('data-note-id', noteStatus.id);
    note.innerHTML = '<div class="note-move-button"></div>' +
                     '<div class="note-remove-button"><span>&#128465;</span></div>' +
                     '<div class="note-textarea">' +
                       '<textarea></textarea>' +
                     '</div>';
    document.body.appendChild(note);
    setNoteHandlers(note);
    note.getElementsByTagName('textarea')[0].value = noteStatus.text;
    note.style.left = noteStatus.X;
    note.style.top = noteStatus.Y;
    note.style.zIndex = noteStatus.Z;
    return note;
};

function setNoteHandlers(note) {
    note.addEventListener('mousedown', function(event) {
        if (event.target.className === 'note-move-button') {
            movingNote = note;
        };
        if (note.style.zIndex <= maxZIndex) {
            note.style.zIndex = maxZIndex++;
        };
    });

    var removeButton = note.getElementsByClassName('note-remove-button')[0]
    removeButton.addEventListener('click', function(event) {
        document.body.removeChild(note);
        var noteId = note.getAttribute('data-note-id');
        localStorageRemoveNote(noteId);
        // event.stopPropagation();
    });

    var textArea = note.getElementsByTagName('textarea')[0]
    textArea.addEventListener('blur', function(){
        var noteStatus = getNoteStatus(note);
        localStorageSaveNote(noteStatus);
    });
};

function getNoteStatus(noteElem) {
    var noteId = noteElem.getAttribute('data-note-id');
    var textArea = noteElem.getElementsByTagName('textarea')[0];
    var noteStatus = {};
    noteStatus.id = +noteId;
    noteStatus.text = textArea.value;
    noteStatus.Z = +noteElem.style.zIndex;
    noteStatus.X = noteElem.style.left;
    noteStatus.Y = noteElem.style.top;
    return noteStatus;
};

function localStorageSaveNote(noteStatus) {
    var notes = localStorageGetNotes();
    var index = notes.findIndex(function(elem) {
        return elem.id === noteStatus.id;
    });
    if (index >= 0) {
        notes.splice(index, 1, noteStatus);
    } else {
        notes.push(noteStatus);
    }
    localStorage.setItem('notes', JSON.stringify(notes));
};

function localStorageRemoveNote(noteId) {
    var notes = localStorageGetNotes();
    var index = notes.findIndex(function(elem) {
        return elem.id === noteId;
    });
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
};

function localStorageGetNotes() {
    var notes = localStorage.getItem('notes');
    if (notes) {
        return JSON.parse(notes);
    } else {
        localStorage.setItem('notes', '[]');
        return [];
    };
};

function loadNotes() {
    var notes = localStorageGetNotes();
    notes.forEach(function(note) {
        createNote(note);
    });
    maxZIndex = notes.reduce(function(accumulator, value) {
                    return (accumulator < value.Z) ? value.Z : accumulator
                }, 0);
    noteId = notes.reduce(function(accumulator, value) {
                return (accumulator < value.id) ? value.id : accumulator
            }, 0);
};

document.addEventListener('mousemove', function(event) {
    if (movingNote) {
        document.body.style.overflow = 'hidden';
        if (event.pageX >= (document.documentElement.clientWidth - 30)) {
            movingNote.style.left = (document.documentElement.clientWidth - 30) + 'px';
        } else {
            movingNote.style.left = event.pageX + 'px';
        };
        if (event.pageY >= (document.documentElement.clientHeight - 30)) {
            movingNote.style.top = (document.documentElement.clientHeight - 30) + 'px';
        } else if (event.pageY <= 0) {
            movingNote.style.top = 0 + 'px';
        } else {
            movingNote.style.top = event.pageY + 'px';
        };
    };
});

document.addEventListener('mouseup', function() {
    if (movingNote) {
        var noteStatus = getNoteStatus(movingNote);
        localStorageSaveNote(noteStatus);
        movingNote = null;
        document.body.style.overflow = 'visible';
    };
});

window.addEventListener('load', loadNotes);

addButton.addEventListener('click', function() {
    var note = createNote({id: ++noteId, Z: ++maxZIndex});
    var noteStatus = getNoteStatus(note);
    localStorageSaveNote(noteStatus);
});