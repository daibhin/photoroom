import { ChangeEvent } from "react";
import { Folder, Image } from "../types";

export default function ImageView({
  image,
  alternativeFolders,
  onMoveFolder,
}: {
  image: Image;
  alternativeFolders: Folder[];
  onMoveFolder: (folderId: number) => void;
}): JSX.Element {
  return (
    <>
      <img
        src={image.original}
        width={300}
        alt="original file uploaded"
        className="rounded-md"
      />
      <img
        src={image.result}
        width={300}
        alt="result from the API"
        className="rounded-md"
      />
      <div className="flex items-center">
        <FolderSelector folders={alternativeFolders} onSelect={onMoveFolder} />
      </div>
    </>
  );
}

const FolderSelector = ({
  folders,
  onSelect,
}: {
  folders: Folder[];
  onSelect: (id: number) => void;
}) => {
  let onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onSelect(parseInt(event.target.value));
  };

  return (
    <select
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option>Move folder...</option>
      {folders.map((folder) => {
        return (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        );
      })}
    </select>
  );
};
