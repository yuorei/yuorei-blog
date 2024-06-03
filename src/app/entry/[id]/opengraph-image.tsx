import { ImageResponse } from "next/og";
import { getArticle } from "./getArticle";

export const contentType = "image/png";
export const revalidate = "force-cache";
export const runtime = "nodejs";

export const alt = "Article Detail";
export const size = {
  width: 1200,
  height: 630,
};

export default async function og({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  try {
    let imageResponse = new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 88,
            background: "#fff",
            color: "#000",
          }}
        >
          <img
            src={
              article.OGPURL ||
              "https://blog.yuorei.com/opengraph-image.png"
            }
            alt={article?.Title}
          />
        </div>
      ),
      {
        ...size,
      }
    );
    return imageResponse;
  } catch (error) {
    console.error("OGP error: ", error);
  }
}