import classNames from "../lib/styles";
import { Folder } from "../types";

export default function Sidebar({
  activeFolderId,
  folders,
  onAddFolder,
  onSelectFolder,
}: {
  activeFolderId: number;
  folders: Array<Folder>;
  onAddFolder: () => void;
  onSelectFolder: (id: number) => void;
}): JSX.Element {
  return (
    <div className="w-[300px] border-r px-4 py-12 space-y-4">
      <div className="space-y-2">
        {folders.map((folder) => {
          return (
            <div
              className={classNames(
                "hover:bg-red-500",
                activeFolderId == folder.id ? "bg-gray-100 text-bold" : ""
              )}
              onClick={() => onSelectFolder(folder.id)}
            >
              {folder.name}
            </div>
          );
        })}
      </div>

      <button
        onClick={onAddFolder}
        className="bg-gray-100 rounded w-full py-2 hover:bg-gray-200"
      >
        Add folder
      </button>
    </div>
  );
}
