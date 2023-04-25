export default function EmptyState(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="font-bold">This folder is empty</div>
      <div className="text-sm text-gray-600">Try uploading a photo</div>
    </div>
  );
}
