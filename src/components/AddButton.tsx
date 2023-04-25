import React, { ChangeEvent } from "react";
import start from "../startButton.svg";

export default function AddButton({
  onImageAdd,
}: {
  onImageAdd: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  return (
    <div>
      <label className="add-button-label" htmlFor="customFileAdd">
        <input
          type="file"
          onChange={onImageAdd}
          className="file-input"
          id="customFileAdd"
          accept=".png, .jpg, .jpeg"
        />
        <img src={start} alt="" className="add-button-image" />
      </label>
    </div>
  );
}
