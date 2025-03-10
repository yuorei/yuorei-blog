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

export default async function getBlog({ id }: { id: string }) {
  const pageId = id
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
    return null
  }

  const list: NotionDatabaseResponse = await res.json()

  if (!list.results || list.results.length === 0) {
    return null
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
      console.error("Failed to load page from Notion:", res.statusText)
      return null
    }

    data = (await res.json()) as NotionResponse
  } catch (err) {
    console.error("Failed to load page from Notion:", err)
    return null
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

  return {
    markdownContent,
    title,
    createDate,
    image_url,
  }
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}
