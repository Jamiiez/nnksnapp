import { mockDistricts } from "@/lib/mockData";
import { fetchSheetData } from "@/lib/sheets";
import { DailyTable } from "@/components/DailyTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

// Since we are using static export or simple build, we can generate static params if needed,
// but for now we'll just use dynamic rendering logic.
// However, in Next.js App Router, we need to handle params correctly.

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = "force-dynamic";

export default async function DistrictPage({ params }: PageProps) {
    const { id } = await params;
    const sheetData = await fetchSheetData();
    const data = sheetData || mockDistricts;
    const district = data.find((d) => d.id === id);

    if (!district) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    ย้อนกลับ
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{district.name}</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                    สถิติการปฏิบัติงานรายวัน (29 ธันวาคม 2568 - 4 มกราคม 2569)
                </h2>
                <DailyTable stats={district.stats} />
            </div>
        </div>
    );
}
