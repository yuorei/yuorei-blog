'use client';
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from 'next/link';

export type Article = {
  ID: string;
  Title: string;
  Content: string;
  Date: string;
  IsPublic: boolean;
  OGPURL: string;
};

export default function Blog() {
  // const articles = await getArticles();
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
        if (response.status === 404) {
          notFound();
        }
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data: Article[] = await response.json();
        // Dateを降順でソート

        const sortedData = data.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

        setArticles(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="bg-gray-100 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">yuorei blog</h1>
        <ul className="max-w-4xl mx-auto">
          {articles.map((article, index) => (
            <Link href={`entry/${article.ID}`} key={index}>
              <li className="bg-white rounded-lg shadow-md mb-4 flex items-center justify-between p-4">
                <div>
                  <h2 className="text-xl font-semibold">{article.Title}</h2>
                  <p className="text-gray-500">{article.Date}</p>
                </div>
                <img
                  src={article.OGPURL}
                  alt={article.Title}
                  className="w-24 h-24 object-contain"
                />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
