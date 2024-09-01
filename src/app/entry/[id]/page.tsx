import ArticleComponent from "@/app/components/Article";
import { getArticle } from "./getArticle";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  let article = await getArticle(id);
  if (article.Content.length > 100) {
    article.Content = article.Content.slice(0, 100) + "...";
  }

  return {
    title: article?.Title || "yuorei blog",
    description: article?.Content || "yuoreiのブログサイトです。",
    openGraph: {
      title: article?.Title || "yuorei blog",
      description: article?.Content || "yuoreiのブログサイトです。",
      type: "website",
      url: `https://blog.yuorei.com/entry/${id}`,
      images: [
        article?.OGPURL || "https://blog.yuorei.com/opengraph-image.png",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article?.Title || "yuorei blog",
      description: article?.Content || "yuoreiのブログサイトです。",
      site: "@yuorei71",
      creator: "@yuorei71",
      images: [
        article?.OGPURL || "https://blog.yuorei.com/opengraph-image.png",
      ],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);
  return <ArticleComponent article={article} />;
}
