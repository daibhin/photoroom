import React, { ChangeEvent, useReducer, useState } from "react";
import "./App.css";
import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "./Constants";
import Sidebar from "./components/Sidebar";
import ImageView from "./components/Image";
import { Image } from "./types";

const reducer = (
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

function App() {
  const [images, dispatch] = useReducer(reducer, []);

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

  let onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImageToServer(e.target.files[0]);
    } else {
      console.error("No file was picked");
    }
  };

  return (
    <div className="App flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <div className="header border-b justify-end flex">
          <AddButton onImageAdd={onImageAdd} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 align-middle">
          {images.map((image, index) => {
            return <ImageView key={index} image={image} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
