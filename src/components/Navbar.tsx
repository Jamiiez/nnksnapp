import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
                                <BarChart3 className="h-8 w-8" />
                                <span>Highway Stats 2569</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
}
