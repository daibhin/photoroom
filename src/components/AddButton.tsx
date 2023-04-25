import React, { ChangeEvent } from "react";

export default function AddButton({
  uploading,
  onImageAdd,
}: {
  uploading: boolean;
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
          disabled={uploading}
        />
        <div className="bg-purple-400 text-white hover:bg-purple-600 px-3 py-2 rounded font-bold">
          {uploading ? "Uploading..." : "Upload"}
        </div>
      </label>
    </div>
  );
}
