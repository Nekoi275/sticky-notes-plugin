var addButton = document.getElementsByClassName('note-add')[0]
var workspaceParams = {width: 1200, height: 500, parent: document.body};
var notes = new StickyNotes(addButton, workspaceParams);
notes.createNote({text: 'lorem ipsum'});
