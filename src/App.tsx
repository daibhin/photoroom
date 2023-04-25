import React, { ChangeEvent, useState } from "react";
import "./App.css";
import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "./Constants";

type Base64Image = string | undefined;

type Image = { original: Base64Image; result: Base64Image };

function App() {
  const [images, setImages] = useState<Image[]>([]);

  let uploadImageToServer = (file: File) => {
    loadImage(file, {
      maxWidth: 400,
      maxHeight: 400,
      canvas: true,
    })
      .then(async (imageData: LoadImageResult) => {
        let localImage = {} as Image;

        let image = imageData.image as HTMLCanvasElement;

        let imageBase64 = image.toDataURL("image/png");

        localImage.original = imageBase64;

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

        localImage.result = base64Result;

        let newImages = [...images];
        newImages.push(localImage);

        setImages(newImages);
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
    <div className="App">
      <header className="App-header">
        <AddButton onImageAdd={onImageAdd} />

        {images.map((image) => {
          return (
            <div>
              <img
                src={image.original}
                width={300}
                alt="original file uploaded"
              />
              <img src={image.result} width={300} alt="result from the API" />
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
