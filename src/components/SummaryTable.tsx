import Link from "next/link";
import { District } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface SummaryTableProps {
    districts: District[];
}

export function SummaryTable({ districts }: SummaryTableProps) {
    // Calculate totals for each district
    const districtTotals = districts.map((district) => {
        const totalStaff = Math.round(district.stats.reduce((acc, curr) => acc + curr.staffCount, 0) / (district.stats.length || 1));
        const totalService = district.stats.reduce((acc, curr) => acc + curr.serviceUsers, 0);
        const totalRestroom = district.stats.reduce((acc, curr) => acc + curr.restroomUsers, 0);
        const totalAssistance = district.stats.reduce((acc, curr) => acc + curr.assistanceCount, 0);
        const totalAccident = district.stats.reduce((acc, curr) => acc + curr.accidentCount, 0);
        const totalFatality = district.stats.reduce((acc, curr) => acc + curr.fatalityCount, 0);

        return {
            ...district,
            totals: {
                staff: totalStaff,
                service: totalService,
                restroom: totalRestroom,
                assistance: totalAssistance,
                accident: totalAccident,
                fatality: totalFatality,
            },
        };
    });

    // Calculate grand totals
    const grandTotal = districtTotals.reduce(
        (acc, curr) => ({
            staff: acc.staff + curr.totals.staff,
            service: acc.service + curr.totals.service,
            restroom: acc.restroom + curr.totals.restroom,
            assistance: acc.assistance + curr.totals.assistance,
            accident: acc.accident + curr.totals.accident,
            fatality: acc.fatality + curr.totals.fatality,
        }),
        { staff: 0, service: 0, restroom: 0, assistance: 0, accident: 0, fatality: 0 }
    );

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            หน่วยงาน
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            เจ้าหน้าที่ (เฉลี่ย/วัน)
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ผู้ใช้บริการ (ราย)
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ห้องน้ำ (ราย)
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ช่วยเหลือ (ครั้ง)
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-red-500 dark:text-red-400 uppercase tracking-wider">
                            อุบัติเหตุ (ครั้ง)
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wider">
                            เสียชีวิต (ราย)
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">รายละเอียด</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {districtTotals.map((district) => (
                        <tr key={district.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {district.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {district.totals.staff.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {district.totals.service.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {district.totals.restroom.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {district.totals.assistance.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium text-right">
                                {district.totals.accident.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-bold text-right">
                                {district.totals.fatality.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/district/${district.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center gap-1">
                                    รายละเอียด <ArrowRight className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {/* Grand Total Row */}
                    <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100">
                            รวมทั้งหมด
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {grandTotal.staff.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {grandTotal.service.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {grandTotal.restroom.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {grandTotal.assistance.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 dark:text-red-300 text-right">
                            {grandTotal.accident.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                            {grandTotal.fatality.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {/* Empty cell for action column */}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
