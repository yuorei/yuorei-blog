// components/NotionRendererClient.tsx
'use client'

import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import 'react-notion-x/src/styles.css' // 必要に応じてスタイルをインポート

type Props = {
  recordMap: ExtendedRecordMap
}

export default function DynamicNotionRenderer({ recordMap }: Props) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={false}
    />
  )
}
