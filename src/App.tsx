import React, { ChangeEvent, useReducer, useState } from "react";
import "./App.css";
import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "./Constants";
import Sidebar from "./components/Sidebar";
import ImageView from "./components/Image";
import { Image, Folder } from "./types";

type CreateAction = { type: "create" };
type AddAction = { type: "add"; image: Image };
type SelectAction = { type: "select"; id: number };
type MoveAction = { type: "move"; imageId: number; folderId: number };

const foldersReducer = (
  state: {
    activeFolderId: number;
    folders: Folder[];
    images: Image[];
  },
  action: CreateAction | AddAction | SelectAction | MoveAction
) => {
  switch (action.type) {
    case "create":
      let newFolders = [...state.folders];

      newFolders.push({
        name: `Folder ${newFolders.length + 1}`,
        id: newFolders.length,
      });
      return { ...state, folders: newFolders };
    case "add": {
      let newImages = [...state.images];
      let newImage = { ...action.image, folderId: state.activeFolderId };
      newImages.push(newImage);
      return { ...state, images: newImages };
    }
    case "move": {
      let newImages = [...state.images];
      let newImage = newImages[action.imageId];
      newImages.splice(action.imageId, 1, {
        ...newImage,
        folderId: action.folderId,
      });
      return { ...state, images: newImages };
    }
    case "select":
      return { ...state, activeFolderId: action.id };
    default:
      return state;
  }
};

const initialFolderId = 0;
const initialFolders = {
  activeFolderId: initialFolderId,
  folders: [{ name: "Untitled Folder", id: initialFolderId }],
  images: [],
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

        let newImage = {
          id: images.length,
          original: imageBase64,
          result: base64Result,
          folderId: null,
        };
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

  let images = state.images.filter((i) => i.folderId == state.activeFolderId);

  return (
    <div className="App flex h-screen">
      <Sidebar
        activeFolderId={state.activeFolderId}
        folders={state.folders}
        onAddFolder={handleOnAddFolder}
        onSelectFolder={handleOnSelectFolder}
      />
      <div className="flex-1">
        <div className="header border-b justify-end flex">
          <AddButton onImageAdd={handleOnAddImage} />
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-12 align-middle">
          {images.map((image, index) => {
            return (
              <ImageView
                key={index}
                image={image}
                alternativeFolders={state.folders.filter(
                  (f) => f.id != image.folderId
                )}
                onMoveFolder={(folderId: number) => {
                  dispatch({ type: "move", folderId, imageId: image.id });
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
