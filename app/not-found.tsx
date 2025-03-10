import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <div className="w-16 h-1 bg-primary my-6"></div>
      <h2 className="text-3xl font-semibold mb-4">ページが見つかりません</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        お探しのページは存在しないか、移動または削除された可能性があります。
      </p>
      <button className="gap-2 bg-black rounded-md">
        <Link href="/">
          <p className="text-white m-2">ホームに戻る</p>
        </Link>
      </button>
    </div>
  )
}

