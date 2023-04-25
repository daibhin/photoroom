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
        <div className="bg-gray-100 hover:bg-gray-200 m-2 px-3 py-2 rounded">
          Upload
        </div>
      </label>
    </div>
  );
}
