type Base64Image = string | undefined;

type Image = { original: Base64Image; result: Base64Image };

type Folder = { id: number; name: string };

export type { Image, Folder };
