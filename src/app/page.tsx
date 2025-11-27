import { mockDistricts } from "@/lib/mockData";
import { fetchSheetData } from "@/lib/sheets";
import { SummaryTable } from "@/components/SummaryTable";
import { DashboardCharts } from "@/components/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sheetData = await fetchSheetData();
  const data = sheetData || mockDistricts;
  const isMock = !sheetData;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">รายงานสรุปผลการปฏิบัติงาน</h1>
          <p className="text-gray-500 mt-1">เทศกาลปีใหม่ 2569 (29 ธ.ค. 68 - 4 ม.ค. 69)</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${isMock ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
          }`}>
          สถานะ: {isMock ? "ข้อมูลจำลอง (Mock Data)" : "ข้อมูลจริง (Google Sheets)"}
        </div>
      </div>

      <DashboardCharts districts={data} />

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">ตารางสรุปข้อมูลรายหน่วยงาน</h2>
        <SummaryTable districts={data} />
      </div>
    </div>
  );
}
