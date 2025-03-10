import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarIcon, ArrowLeft, Clock } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Metadata, ResolvingMetadata } from "next"
import getBlog from "./getBlog"

interface TextObject {
  type: "text"
  text: {
    content: string
    link: string | null
  }
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
  plain_text: string
  href: string | null
}

interface CodeBlock {
  rich_text: TextObject[]
  language: string
}

interface Block {
  object: "block"
  id: string
  type: string
  code?: CodeBlock
  paragraph?: {
    rich_text: TextObject[]
  }
  heading_1?: {
    rich_text: TextObject[]
  }
  heading_2?: {
    rich_text: TextObject[]
  }
  heading_3?: {
    rich_text: TextObject[]
  }
  bulleted_list_item?: {
    rich_text: TextObject[]
  }
  numbered_list_item?: {
    rich_text: TextObject[]
  }
  quote?: {
    rich_text: TextObject[]
  }
  image?: {
    file?: {
      url: string
    }
    external?: {
      url: string
    }
    caption: TextObject[]
  }
}

interface NotionResponse {
  object: "list"
  results: Block[]
  next_cursor: string | null
  has_more: boolean
}

type NotionDatabaseResponse = {
  results: Array<{
    id: string
    properties: {
      title?: {
        title: Array<{
          plain_text: string
        }>
      }
      page_id: {
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

type Props = {
  params: Promise<{ pageId: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const paramsId = await params;
  const id = paramsId.pageId;
  // parentの使い道がわからないのでとりあえずconsole.logで出力
  console.log("parent", parent);
  const blog = await getBlog({ id });

  return {
    title: blog?.title || "ユオレイブログ",
    description: blog?.markdownContent || "ユオレイブログ",
    openGraph: {
      title: blog?.title || "ユオレイブログ",
      description: blog?.markdownContent || "ユオレイブログ",
      type: "website",
      url: `https://blog.yuorei.com/entry/${id}`,
      images: [
        blog?.image_url ||
        "https://blog.yuorei.com/opengraph-image.png",
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog?.title || "ユオレイブログ",
      description: blog?.markdownContent || "ユオレイブログ",
      site: "@yuorei71",
      creator: "@yuorei71",
      images: [
        blog?.image_url ||
        "https://blog.yuorei.com/opengraph-image.png",
      ],
    },
  };
}


export default async function NotionDetailPage({ params }: { params: Promise<{ pageId: string }>; }) {
  const { pageId } = await params

  // Fetch public page from Notion database
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
        and: [
          {
            property: "public",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "page_id",
            rich_text: {
              equals: pageId,
            },
          },
        ],
      },
    }),
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch Notion DB")
  }

  const list: NotionDatabaseResponse = await res.json()

  if (!list.results || list.results.length === 0) {
    notFound()
  }

  const page = list.results[0]
  const block_url = page.url.split("-").pop()
  const image_url = page.properties.image_url.url
  const title = page.properties.title?.title[0]?.plain_text || "Untitled"
  const createDate = formatDate(page.properties.createdat.date.start)

  let data: NotionResponse

  // Fetch page content (blocks) from Notion
  try {
    const res = await fetch(`https://api.notion.com/v1/blocks/${block_url}/children?page_size=100`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to fetch data from Notion")
    }

    data = (await res.json()) as NotionResponse
  } catch (err) {
    console.error("Failed to load page from Notion:", err)
    notFound()
  }

  // Convert Notion blocks to Markdown
  const notionBlocksToMarkdown = (blocks: Block[]): string => {
    return blocks
      .map((block) => {
        switch (block.type) {
          /* ここ使われていないのでコメントアウト
          case "paragraph":
            return block.paragraph?.rich_text.map((text) => text.plain_text).join("") || ""
          case "heading_1":
            return "# " + (block.heading_1?.rich_text.map((text) => text.plain_text).join("") || "")
          case "heading_2":
            return "## " + (block.heading_2?.rich_text.map((text) => text.plain_text).join("") || "")
          case "heading_3":
            return "### " + (block.heading_3?.rich_text.map((text) => text.plain_text).join("") || "")
          case "bulleted_list_item":
            return "- " + (block.bulleted_list_item?.rich_text.map((text) => text.plain_text).join("") || "")
          case "numbered_list_item":
            return "1. " + (block.numbered_list_item?.rich_text.map((text) => text.plain_text).join("") || "")
          case "quote":
            return "> " + (block.quote?.rich_text.map((text) => text.plain_text).join("") || "")
          */
          case "code":
            if (!block.code) return ""
            return (
              // "```" +
              // block.code.language +
              // "\n" +
              block.code.rich_text.map((text) => text.plain_text).join("")
              // "\n```"
            )
          case "image":
            const url = block.image?.file?.url || block.image?.external?.url || ""
            const caption = block.image?.caption.map((text) => text.plain_text).join("") || "Image"
            return `![${caption}](${url})`
          default:
            return ""
        }
      })
      .join("\n\n")
  }

  const markdownContent = notionBlocksToMarkdown(data.results)
  const readingTime = calculateReadingTime(markdownContent)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with image */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <Image src={image_url || "/placeholder.svg"} alt={title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all posts
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <time dateTime={page.properties.createdat.date.start}>{createDate}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b pb-2">{children}</h1>
                ),
                h2: ({ children }) => <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-medium text-gray-700 mt-8 mb-3">{children}</h3>,
                p: ({ children }) => <p className="text-gray-600 leading-relaxed mb-6">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-600">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-gray-600">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-700 bg-blue-50 p-3 rounded">
                    {children}
                  </blockquote>
                ),
                pre: ({ children }) => <pre className="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">{children}</pre>,
                code: ({ children }) => <code className="font-semibold text-white mt-10 mb-4">{children}</code>,
                img: ({ src, alt }) => (
                  <div className="my-8">
                    <img src={src || "/placeholder.svg"} alt={alt} className="rounded-lg shadow-md w-full" />
                    {alt && alt !== "Image" && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
                  </div>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-2"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </article>

        {/* Author section */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mt-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src="/yuorei.png"
              alt="Author"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">yuorei</h3>
            <p className="text-gray-600 mb-4">
              ソフトウェアエンジニアを目指して修行中
            </p>
            <div className="flex gap-3">
              <Link href="https://twitter.com/yuorei71" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                Twitter
              </Link>
              <Link href="https://github.com/yuorei" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
              <Link href="https://yuorei.com" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
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

// Helper function to calculate reading time
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return Math.max(1, readingTime) // Minimum 1 minute
}

