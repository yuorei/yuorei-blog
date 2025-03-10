import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from './MobileMenu'

const Header = () => {
    return (
        <header className=" left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* ロゴ */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-gray-800">
                            <Image src="/logo.png" alt="ロゴ" width={100} height={100} />
                        </Link>
                    </div>

                    {/* ナビゲーション */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            ホーム
                        </Link>
                        <Link href="https://yuorei.com" className="text-gray-600 hover:text-gray-900" target="_blank">
                            プロフィール
                        </Link>
                    </nav>
                    <div className="md:hidden">
                        <MobileMenu />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
