import React, { ChangeEvent } from "react";

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
        <div className="bg-purple-400 text-white hover:bg-purple-600 px-3 py-2 rounded font-bold">
          Upload
        </div>
      </label>
    </div>
  );
}
