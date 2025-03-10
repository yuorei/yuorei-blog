import Link from "next/link"
import Image from "next/image"
import { CalendarIcon } from "lucide-react"

type NotionDatabaseResponse = {
  results: Array<{
    id: string
    properties: {
      title?: {
        title: Array<{
          plain_text: string
        }>
      }
      page_id?: {
        rich_text: Array<{
          plain_text: string
        }>
      }
      createdat: {
        date: {
          start: string
        }
      }
      image_url: {
        url: string
      }
    }
    url: string
  }>
}

export default async function BlogIndexPage() {
  const notionApiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filter: {
        property: "public",
        checkbox: {
          equals: true,
        },
      },
    }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch Notion DB")
  }
  const data: NotionDatabaseResponse = await res.json()

  // Format page information
  const pages = data.results.map((page) => {
    const titleProperty = page.properties.title
    const title = titleProperty?.title?.[0]?.plain_text || "No Title"
    const url = page.url
    const pageId = page.properties.page_id?.rich_text[0].plain_text
    const imageUrl = page.properties.image_url.url
    const createdat = page.properties.createdat.date.start
    return {
      id: page.id,
      title,
      pageId,
      url,
      imageUrl,
      createdat: formatDate(createdat),
    }
  })

  return (
    <main className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">ユオレイブログ</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pages.map((post) => (
          <Link
            key={post.pageId}
            href={`/entry/${post.pageId}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <Image
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.createdat}>{post.createdat}</time>
              </div>
              <h2 className="text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <div className="mt-auto pt-4">
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  Read more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

// Helper function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

