import { ImageResponse } from "next/og";
import getBlog from "./getBlog";
import React from "react";

export const contentType = "image/png";

export const size = {
  width: 1200,
  height: 630,
};

export default async function og({ params }: { params: { id: string } }) {
  const id = params.id;
  let blog = await getBlog({ id });
  console.log("OGP動画取得", blog);
  try {
    console.log("OGP画像URL", blog?.image_url);
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
              blog?.image_url ||
              "https://blog.yuorei.com/opengraph-image.png"
            }
            alt={blog?.title}
          />
        </div>
      ),
      {
        ...size,
      }
    );
    console.log("OGP画像", imageResponse);
    return imageResponse;
  } catch (error) {
    console.error("OGPエラー", error);
  }
}

export const runtime = "nodejs";