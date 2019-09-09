
## Sticky notes plugin

### `new StickyNotes(addNoteButton, workspaceParams)`

<table>
    <thead>
        <tr>
            <th>Parameter name</th>
            <th>Default value</th>
            <th>Values range</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>addNoteButton</td>
            <td>undefined</td>
            <td>HTML element</td>
            <td>An element, which will get "click" event listener for adding new note</td>
        </tr>
        <tr>
            <td>workspaceParams</td>
            <td><pre lang="js">
{
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  removing: true,
  parent: document.body,
  notesLimit: 0
}</pre>
            </td>
            <td>object</td>
            <td>An object with parameters used to create an area for working with notes</td>
        </tr>
    </tbody>
</table>

### `workspaceParams`

<table>
    <thead>
        <tr>
            <th>Key name</th>
            <th>Default value</th>
            <th>Values range</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>width</td>
            <td><pre lang="js">document.documentElement.clientWidth</pre></td>
            <td>number</td>
            <td>Sets width of the workspace</td>
        </tr>
        <tr>
            <td>height</td>
            <td><pre lang="js">document.documentElement.clientHeight</pre></td>
            <td>number</td>
            <td>Sets height of the workspace</td>
        </tr>
        <tr>
            <td>removing</td>
            <td><pre lang="js">true</pre></td>
            <td>boolean</td>
            <td>Sets if it is possible to remove notes from the workspace</td>
        </tr>
        <tr>
            <td>parent</td>
            <td><pre lang="js">document.body</pre></td>
            <td>HTML element</td>
            <td>Sets parent element of the workspace</td>
        </tr>
        <tr>
            <td>notesLimit</td>
            <td><pre lang="js">0</pre></td>
            <td>number</td>
            <td>Sets how many notes is it possible to add to the workspace, where 0 means no limit</td>
        </tr>
    </tbody>
</table>

### `StickyNotes.createNote(noteStatus)`

A public function for creating notes without    `addNoteButton`

noteStatus is an object including the following:
<table>
    <thead>
        <tr>
            <th>Key name</th>
            <th>Default value</th>
            <th>Values range</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>X</td>
            <td>0</td>
            <td>number</td>
            <td>Sets the note's style.left</td>
        </tr>
        <tr>
            <td>Y</td>
            <td>0</td>
            <td>number</td>
            <td>Sets the note's style.top</td>
        </tr>
        <tr>
            <td>text</td>
            <td>empty string</td>
            <td>any</td>
            <td>The text shown at the note's textarea</td>
        </tr>
        <tr>
            <td>width</td>
            <td>300px</td>
            <td>number</td>
            <td>Sets note width</td>
        </tr>
        <tr>
            <td>height</td>
            <td>300px</td>
            <td>number</td>
            <td>Sets note height</td>
        </tr>
    </tbody>
</table>

### `StickyNotes.localStorageGetNotes()`
A public function, which returns an array with all note statuses kept at local storage
