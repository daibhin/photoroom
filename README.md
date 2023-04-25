# Getting Started with this template

Make sure you follow the .nvmrc and use Node 16

Start the app using the following command, replacing the key by your API key:

    REACT_APP_API_KEY="your_api_key" yarn run start


## Tasks
- [x] Install NVM & v16.18.0
- [x] Run app
- [x] Understand existing code & simplify (if needed)
- [x] Display uploaded images in "Untitled Folder"
- [x] Allow users to create new folders
    - [x] Create button
    - [x] Show folders in list
    - [x] Highlight selected folder
    - [x] Folder switching
    - [x] Tie images to active folder
    - [x] Filter images by folder
- [x] Move images between folders
    - [x] Remove nested images in favour of folderId on image
    - [x] Add 'move' method to reducer
    - [x] Filter images in active folder
    - [x] Add UI to choose folder to move to
- [x] Store application state in local storage
    - [x] Build local storage hook
    - [x] Migrate from `useReducer` to `useLocalStorage`