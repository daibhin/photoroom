import { Image } from "../types";

export default function ImageView({ image }: { image: Image }): JSX.Element {
  return (
    <>
      <div className="flex w-full items-center">
        <img src={image.original} width={300} alt="original file uploaded" />
      </div>
      <img src={image.result} width={300} alt="result from the API" />
    </>
  );
}
