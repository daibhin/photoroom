import { API_KEY, API_URL } from "../Constants";

const upload = async (data: { image_file_b64: string }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify(data),
  });

  if (response.status >= 400 && response.status < 600) {
    throw new Error("Bad response from server");
  }

  const result = await response.json();
  return result;
};

export { upload };
