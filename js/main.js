var addButton = document.getElementsByClassName('note-add')[0]
var workspaceParams = {width: 1200, height: 500, parent: document.body};
var notes = new StickyNotes(addButton, workspaceParams);
//notes.createNote({X: 100, Y: 0, text: 'lorem ipsum', width: 500, height: 700});
//var localNotes = notes.localStorageGetNotes();
//console.log(localNotes);