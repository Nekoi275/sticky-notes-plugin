function StickyNotes(addNoteButton, workspaceParams) {
    var noteId;
    var maxZIndex;
    var activeNote;
    var workspace;
    var self = this;

    init();
    
    this.createNote = function(noteStatus) {
        if (!isDefined(noteStatus) ) 
            noteStatus = {};
        if (!isDefined(noteStatus.Z) )
            noteStatus.Z = ++maxZIndex;
        if (!isDefined(noteStatus.text) )
            noteStatus.text = '';

        if (!isDefined(noteStatus.id) ) 
            noteStatus.id = ++noteId; 
        else 
            removeNote(noteStatus.id);

        var note = createNoteElement(noteStatus);
        if (note) 
            localStorageSaveNote(noteStatus);
        else 
            alert('notes limit reached');
    };
    
    function setWorkspace(workspaceParams) {
        workspace = document.createElement('div');
        workspace.classList.add('notes-workspace');
        workspace.style.width = workspaceParams.width + 'px';
        workspace.style.height = workspaceParams.height + 'px';
        workspaceParams.parent.appendChild(workspace);
        if (!isDefined(workspaceParams.removing) ) {
            workspaceParams.removing = true;
        };
        if (!isDefined(workspaceParams.notesLimit) ) {
            workspaceParams.notesLimit = 0;
        };
    };

    function createNoteElement(noteStatus) {
        if (!limitReached()) {
            var note = document.createElement('div');
            note.classList.add('note');
            note.setAttribute('data-note-id', noteStatus.id);
            note.innerHTML = '<a class="note-move-button"></a>' +
                            '<a class="note-remove-button"></a>' +
                            '<div class="note-textarea">' +
                            '<textarea></textarea>' +
                            '</div>';
            if (!workspaceParams.removing) {
                note.getElementsByClassName('note-remove-button')[0].classList.add('hidden');
            };
            workspace.appendChild(note);
            setNoteHandlers(note);
            note.getElementsByTagName('textarea')[0].value = noteStatus.text;
            note.style.left = noteStatus.X + 'px';
            note.style.top = noteStatus.Y  + 'px';
            note.style.zIndex = noteStatus.Z;
        
            return note;
        };
    };

    function setNoteHandlers(note) {
        note.addEventListener('mousedown', function(event) {
            if (event.target.className === 'note-move-button') {
                activeNote = note;
            };
    
            if (note.style.zIndex < maxZIndex) {
                note.style.zIndex = ++maxZIndex;
            };
        });
    
        var removeButton = note.getElementsByClassName('note-remove-button')[0]
        removeButton.addEventListener('click', function() {
            removeNote(+note.getAttribute('data-note-id') );
        });
    
        var textArea = note.getElementsByTagName('textarea')[0]
        textArea.addEventListener('blur', function() {
            localStorageSaveNote(getNoteStatus(note) );
        });
    };

    function getNoteStatus(note) {
        var noteStatus = {};
        noteStatus.id = +note.getAttribute('data-note-id');
        noteStatus.text = note.getElementsByTagName('textarea')[0].value;
        noteStatus.Z = +note.style.zIndex;
        noteStatus.X = +note.style.left.slice(0, -2);
        noteStatus.Y = +note.style.top.slice(0, -2);
        return noteStatus;
    };

    function removeNote(noteId) {
        var note = document.body.querySelector('[data-note-id="' + noteId + '"]');
        if (note) {
            workspace.removeChild(note);
            localStorageRemoveNote(noteId);
        };
    };
    
    function localStorageSaveNote(noteStatus) {
        var noteStatuses = localStorageGetNotes();
        var index = noteStatuses.findIndex( function(elem) {return elem.id === noteStatus.id} );
    
        if (index >= 0) {
            noteStatuses.splice(index, 1, noteStatus);
        } else {
            noteStatuses.push(noteStatus);
        }
    
        localStorage.setItem('notes', JSON.stringify(noteStatuses) );
    };
    
    function localStorageRemoveNote(noteId) {
        var noteStatuses = localStorageGetNotes();
        var index = noteStatuses.findIndex( function(elem) {return elem.id === noteId} );
        if (index >= 0) {
            noteStatuses.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(noteStatuses) );
        };
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
        notes.forEach( function(note) {createNoteElement(note)} );
        maxZIndex = notes.reduce( function(accumulator, value) {
            return (accumulator < value.Z) ? value.Z : accumulator
        }, 0);
        noteId = notes.reduce( function(accumulator, value) {
            return (accumulator < value.id) ? value.id : accumulator
        }, 0);
    };

    function isDefined(value) {
        return typeof value !== 'undefined' && value !== null;
    }

    function limitReached() {
        return localStorageGetNotes().length >= workspaceParams.notesLimit && workspaceParams.notesLimit > 0;
    };

    function mousemoveEventHandler(event) {
        if (activeNote) {
            // document.body.style.cssText = '-moz-user-select: none;' +
            //                               ' -webkit-user-select: none;' + 
            //                               ' user-select: none';
            console.log("X=" + event.clientX + " Y=" + event.clientY);
            console.log("workspaceParams.width " + workspaceParams.width);
            var noteCoords = activeNote.getBoundingClientRect();
            console.log("noteCoords.width " + noteCoords.width);
            if (event.clientX > (workspaceParams.width - noteCoords.width) ) {
                activeNote.style.left = (workspaceParams.width - noteCoords.width) + 'px';
            } else {
                activeNote.style.left = event.clientX + 'px';
            };

            if (event.clientY > (workspaceParams.height - noteCoords.height) ) {
                activeNote.style.top = (workspaceParams.height - noteCoords.height) + 'px';
            } else {
                activeNote.style.top = event.clientY + 'px';
            };
            if (event.clientY < 0) {
                activeNote.style.top = '0px';
            };
        };
    };

    function mouseupEventHandler() {
        if (activeNote) {
            var noteStatus = getNoteStatus(activeNote);
            localStorageSaveNote(noteStatus);
            activeNote = null;
            /* document.body.style.cssText = '-moz-user-select: auto;' +
                                          ' -webkit-user-select: auto;' + 
                                          ' user-select: auto'; */
        };
    };

    function init() {
        if(!isDefined(workspaceParams) ) {
            workspaceParams = {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight,
                removing: true,
                parent: document.body,
                notesLimit: 0
            };
        };
        setWorkspace(workspaceParams);
        loadNotes();
        document.addEventListener('mousemove', mousemoveEventHandler);
        document.addEventListener('mouseup', mouseupEventHandler);

        if (addNoteButton) {
            addNoteButton.addEventListener('click', function() {
                self.createNote({id: ++noteId, Z: ++maxZIndex});
            });
        };
    };
}