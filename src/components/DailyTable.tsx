import { DailyStats } from "@/lib/types";

interface DailyTableProps {
    stats: DailyStats[];
}

export function DailyTable({ stats }: DailyTableProps) {
    // Calculate totals
    const totals = stats.reduce(
        (acc, curr) => ({
            staffCount: acc.staffCount + curr.staffCount,
            serviceUsers: acc.serviceUsers + curr.serviceUsers,
            restroomUsers: acc.restroomUsers + curr.restroomUsers,
            assistanceCount: acc.assistanceCount + curr.assistanceCount,
            accidentCount: acc.accidentCount + curr.accidentCount,
            fatalityCount: acc.fatalityCount + curr.fatalityCount,
        }),
        { staffCount: 0, serviceUsers: 0, restroomUsers: 0, assistanceCount: 0, accidentCount: 0, fatalityCount: 0 }
    );

    // Use average for staff count in totals
    const averageStaff = Math.round(totals.staffCount / (stats.length || 1));

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            วันที่
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
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {stats.map((stat, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(stat.date).toLocaleDateString("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {stat.staffCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {stat.serviceUsers.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {stat.restroomUsers.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 text-right">
                                {stat.assistanceCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium text-right">
                                {stat.accidentCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-bold text-right">
                                {stat.fatalityCount.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100">
                            รวม
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {averageStaff.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {totals.serviceUsers.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {totals.restroomUsers.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900 dark:text-blue-100 text-right">
                            {totals.assistanceCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 dark:text-red-300 text-right">
                            {totals.accidentCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right">
                            {totals.fatalityCount.toLocaleString()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
