import { notFound } from "next/navigation";
interface Article {
    ID: string;
    Title: string;
    Content: string;
    Date: string;
    IsPublic: boolean;
    OGPURL: string;
}

export const getArticle = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`);
    if (res.status === 404 || res == null) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch article");
    }
    const data = await res.json();

    return data as Article;
}