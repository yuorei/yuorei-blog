'use client'
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { Article } from '../../page';
import styles from './article.module.css';


export default function Article({ params }: { params: { id: string } }) {
    const [article, setArticle] = useState<Article>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${params.id}`);
                if (response.status === 404) {
                    notFound();
                }
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [params.id]);
    return (
        <>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-4">{article?.Title}</h1>
                <h2 className="text-gray-600 mb-4">{article?.Date}</h2>
                <div className="relative w-full h-auto">
                    <img
                        src={article?.OGPURL as string}
                        alt={article?.Title as string}
                        className="w-full h-auto object-contain mb-4"
                    />
                </div>
                <ReactMarkdown className={styles.md}>{article?.Content}</ReactMarkdown>
            </div>
        </>
    );
};