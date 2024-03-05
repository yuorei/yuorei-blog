import Image from "next/image";
import { getArticle } from "./getArticle";

export const revalidate = "force-cache";
export const runtime = "nodejs";

export const alt = "Article Detail";
export const size = {
  width: 1200,
  height: 630,
};

export default async function ImageComponent({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  return (
    <div
      style={{
        fontSize: 48,
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{ height: 40, backgroundColor: "#5AC8D8", width: "100%" }}
      />
      <h1
        style={{
          flex: 1,
          maxWidth: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {article.Title}
      </h1>
      <Image src={article.OGPURL} alt={article.Title} width={size.width} height={size.height} />
      <div
        style={{ height: 40, backgroundColor: "#5AC8D8", width: "100%" }}
      />
    </div>
  );
}
