type Base64Image = string | undefined;

type Image = {
  id: number;
  original: Base64Image;
  result: Base64Image;
  folderId: number | null;
};

type Folder = { id: number; name: string };

export type { Image, Folder };
