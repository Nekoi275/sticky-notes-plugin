var addButton = document.getElementsByClassName('note-add')[0]
var workspace = document.body;
var notes = new StickyNotes(addButton, workspace);
notes.createNote({id: 90, text: 'Lorem Ipsum'});
notes.createNote({id: 100, text: 'Lorem Ipsum', X: '200px'});