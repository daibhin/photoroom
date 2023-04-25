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
    <div className="w-[300px] border-r px-4 py-16 space-y-4">
      <div className="space-y-2">
        {folders.map((folder) => {
          return (
            <ListItem
              key={folder.id}
              folder={folder}
              active={activeFolderId == folder.id}
              onClick={() => onSelectFolder(folder.id)}
            />
          );
        })}
      </div>

      <button
        onClick={onAddFolder}
        className="border border-gray-200 text-gray-600 text-sm font-bold rounded w-full py-2 hover:bg-gray-50"
      >
        Add folder
      </button>
    </div>
  );
}

const ListItem = ({
  folder,
  active,
  onClick,
}: {
  folder: Folder;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      key={folder.id}
      className={classNames(
        "py-2 px-1 rounded-md cursor-pointer hover:bg-gray-100",
        active && "bg-gray-100 font-bold"
      )}
      onClick={onClick}
    >
      {folder.name}
    </div>
  );
};
