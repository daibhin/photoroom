import React, { ChangeEvent, useReducer, useState } from "react";
import "./App.css";
import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "./Constants";
import Sidebar from "./components/Sidebar";
import ImageView from "./components/Image";
import { Image, Folder } from "./types";

const imagesReducer = (
  state: Array<Image>,
  action: { type: "add"; image: Image }
) => {
  switch (action.type) {
    case "add":
      let newState = [...state];
      newState.push(action.image);
      return newState;
    default:
      return state;
  }
};

type CreateAction = { type: "create" };
type AddAction = { type: "add"; image: Image };
type SelectAction = { type: "select"; id: number };

const foldersReducer = (
  state: { activeId: number; folders: Array<Folder> },
  action: CreateAction | AddAction | SelectAction
) => {
  switch (action.type) {
    case "create":
      let newFolders = [...state.folders];

      newFolders.push({
        name: `Folder ${newFolders.length + 1}`,
        id: newFolders.length,
        images: [],
      });
      return { ...state, folders: newFolders };
    case "add":
      let folderIndex = state.folders.findIndex(
        (folder) => folder.id == state.activeId
      );

      if (folderIndex > -1) {
        let folder = state.folders[folderIndex];
        let newImages = [...folder.images];

        newImages.push(action.image);

        let newFolders = [...state.folders];
        newFolders.splice(folderIndex, 1, { ...folder, images: newImages });

        return { ...state, folders: newFolders };
      }
      return state;
    case "select":
      return { ...state, activeId: action.id };
    default:
      return state;
  }
};

const initialFolderId = 0;
const initialFolders = {
  activeId: initialFolderId,
  folders: [{ name: "Untitled Folder", id: initialFolderId, images: [] }],
};

function App() {
  const [state, dispatch] = useReducer(foldersReducer, initialFolders);

  let uploadImageToServer = (file: File) => {
    loadImage(file, {
      maxWidth: 400,
      maxHeight: 400,
      canvas: true,
    })
      .then(async (imageData: LoadImageResult) => {
        let image = imageData.image as HTMLCanvasElement;

        let imageBase64 = image.toDataURL("image/png");

        let imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "");
        let data = {
          image_file_b64: imageBase64Data,
        };
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": API_KEY,
          },
          body: JSON.stringify(data),
        });

        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server");
        }

        const result = await response.json();
        const base64Result = BASE64_IMAGE_HEADER + result.result_b64;

        let newImage = { original: imageBase64, result: base64Result };
        dispatch({ type: "add", image: newImage });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  let handleOnAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImageToServer(e.target.files[0]);
    } else {
      console.error("No file was picked");
    }
  };

  let handleOnAddFolder = () => {
    dispatch({ type: "create" });
  };

  let handleOnSelectFolder = (id: number) => {
    dispatch({ type: "select", id: id });
  };

  let activeFolder = state.folders[state.activeId];

  return (
    <div className="App flex h-screen">
      <Sidebar
        activeId={state.activeId}
        folders={state.folders}
        onAddFolder={handleOnAddFolder}
        onSelectFolder={handleOnSelectFolder}
      />
      <div className="flex-1">
        <div className="header border-b justify-end flex">
          <AddButton onImageAdd={handleOnAddImage} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 align-middle">
          {activeFolder.images.map((image, index) => {
            return <ImageView key={index} image={image} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
