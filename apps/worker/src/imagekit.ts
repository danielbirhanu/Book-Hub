export async function uploadCover(
  env: Env,
  file: ArrayBuffer,
  contentType: string,
  fileName: string
) {
  if (!env.IMAGEKIT_PRIVATE_KEY) return null;
  const form = new FormData();
  form.append("file", new Blob([file], { type: contentType }), fileName);
  form.append("fileName", fileName);
  form.append("folder", "/book-hub/covers");
  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${env.IMAGEKIT_PRIVATE_KEY}:`)}`,
      },
      body: form,
    }
  );
  if (!response.ok)
    throw new Error(`ImageKit upload failed with status ${response.status}`);
  return (await response.json()) as {
    filePath: string;
    url: string;
    fileId: string;
  };
}
export function imageUrl(env: Env, path: string | null) {
  return path && env.IMAGEKIT_URL_ENDPOINT
    ? `${env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
    : null;
}
