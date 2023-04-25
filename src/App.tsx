import { ChangeEvent, useEffect, useReducer, useState } from "react";
import "./App.css";
import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { BASE64_IMAGE_HEADER } from "./Constants";
import Sidebar from "./components/Sidebar";
import ImageView from "./components/Image";
import { Image, Folder } from "./types";
import { useLocalStorage } from "./lib/hooks";
import { upload } from "./lib/api";
import EmptyState from "./components/EmptyState";

type CreateAction = { type: "create" };
type AddAction = { type: "add"; original: string; result: string };
type SelectAction = { type: "select"; id: number };
type MoveAction = { type: "move"; imageId: number; folderId: number };

const reducer = (
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
      newImages.push({
        id: newImages.length,
        original: action.original,
        result: action.result,
        folderId: state.activeFolderId,
      });
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
const initialState = {
  activeFolderId: initialFolderId,
  folders: [{ name: "Untitled Folder", id: initialFolderId }],
  images: [],
};

function App() {
  const [localState, setLocalState] = useLocalStorage(initialState);
  const [state, dispatch] = useReducer(reducer, localState);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setLocalState(state);
  }, [state]);

  let uploadImageToServer = async (file: File) => {
    try {
      setUploading(true);
      let imageData = await loadImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        canvas: true,
      });
      let image = imageData.image as HTMLCanvasElement;
      let imageBase64 = image.toDataURL("image/png");
      let imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "");

      const result = await upload({
        image_file_b64: imageBase64Data,
      });

      const base64Result = BASE64_IMAGE_HEADER + result.result_b64;

      dispatch({ type: "add", original: imageBase64, result: base64Result });
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
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
      <div className="flex-1 p-4 space-y-16">
        <div className="justify-end flex">
          <AddButton uploading={uploading} onImageAdd={handleOnAddImage} />
        </div>

        {images.length > 0 ? (
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
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

export default App;
