"use client";

import { useState } from "react";

import { District } from "@/lib/types";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    LabelList,
} from "recharts";

interface DashboardChartsProps {
    districts: District[];
}

export function DashboardCharts({ districts }: DashboardChartsProps) {
    // Get sorted unique dates to find "Today" and "Yesterday"
    const allDates = Array.from(new Set(districts.flatMap(d => d.stats.map(s => s.date)))).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const todayDate = allDates[allDates.length - 1];
    const yesterdayDate = allDates.length > 1 ? allDates[allDates.length - 2] : null;

    const formatDate = (date: string | null) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long' });
    };

    const todayLabel = formatDate(todayDate);
    const yesterdayLabel = yesterdayDate ? formatDate(yesterdayDate) : "ก่อนหน้า";

    const data = districts.map((district) => {
        const totalStaff = Math.round(district.stats.reduce((acc, curr) => acc + curr.staffCount, 0) / (district.stats.length || 1));
        const totalService = district.stats.reduce((acc, curr) => acc + curr.serviceUsers, 0);
        const totalRestroom = district.stats.reduce((acc, curr) => acc + curr.restroomUsers, 0);
        const totalAssistance = district.stats.reduce((acc, curr) => acc + curr.assistanceCount, 0);
        const totalAccident = district.stats.reduce((acc, curr) => acc + curr.accidentCount, 0);
        const totalFatality = district.stats.reduce((acc, curr) => acc + curr.fatalityCount, 0);
        const totalAccident2568 = district.stats.reduce((acc, curr) => acc + curr.accidentCount2568, 0);
        const totalFatality2568 = district.stats.reduce((acc, curr) => acc + curr.fatalityCount2568, 0);

        // Daily stats
        const todayStats = district.stats.find(s => s.date === todayDate) || { accidentCount: 0, fatalityCount: 0 };
        const yesterdayStats = yesterdayDate ? (district.stats.find(s => s.date === yesterdayDate) || { accidentCount: 0, fatalityCount: 0 }) : { accidentCount: 0, fatalityCount: 0 };

        return {
            name: district.name.replace("แขวงทางหลวง", "").replace("สำนักงานทางหลวงที่ 3", "สทล.3"),
            Staff: totalStaff,
            Service: totalService,
            Restroom: totalRestroom,
            Assistance: totalAssistance,
            Accident: totalAccident,
            Fatality: totalFatality,
            Accident2568: totalAccident2568,
            Fatality2568: totalFatality2568,
            AccidentToday: todayStats.accidentCount,
            AccidentYesterday: yesterdayStats.accidentCount,
            FatalityToday: todayStats.fatalityCount,
            FatalityYesterday: yesterdayStats.fatalityCount,
        };
    });

    // Prepare data for Line Chart (Daily Trend for all districts combined)
    // We need to aggregate stats by date across all districts
    const dailyTrendMap = new Map<string, { date: string; service: number; accident: number; fatality: number }>();

    districts.forEach(district => {
        district.stats.forEach(stat => {
            const current = dailyTrendMap.get(stat.date) || { date: stat.date, service: 0, accident: 0, fatality: 0 };
            current.service += stat.serviceUsers;
            current.accident += stat.accidentCount;
            current.fatality += stat.fatalityCount;
            dailyTrendMap.set(stat.date, current);
        });
    });

    const trendData = Array.from(dailyTrendMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate Year-over-Year Totals
    const totalAccident2568 = data.reduce((acc, curr) => acc + curr.Accident2568, 0);
    const totalAccident2569 = data.reduce((acc, curr) => acc + curr.Accident, 0);
    const accidentDiffPercent = totalAccident2568 > 0 ? ((totalAccident2569 - totalAccident2568) / totalAccident2568) * 100 : 0;

    const totalFatality2568 = data.reduce((acc, curr) => acc + curr.Fatality2568, 0);
    const totalFatality2569 = data.reduce((acc, curr) => acc + curr.Fatality, 0);
    const fatalityDiffPercent = totalFatality2568 > 0 ? ((totalFatality2569 - totalFatality2568) / totalFatality2568) * 100 : 0;

    // Calculate Day-over-Day (Yesterday vs Today)
    const todayData = trendData[trendData.length - 1] || { accident: 0, fatality: 0 };
    const yesterdayData = trendData.length > 1 ? trendData[trendData.length - 2] : { accident: 0, fatality: 0 };

    const dailyAccidentDiffPercent = yesterdayData.accident > 0 ? ((todayData.accident - yesterdayData.accident) / yesterdayData.accident) * 100 : 0;
    const dailyFatalityDiffPercent = yesterdayData.fatality > 0 ? ((todayData.fatality - yesterdayData.fatality) / yesterdayData.fatality) * 100 : 0;

    const [expandedChart, setExpandedChart] = useState<string | null>(null);

    const renderChart = (chartId: string, isExpanded: boolean = false) => {
        const height = isExpanded ? "100%" : "100%";

        switch (chartId) {
            case "overview":
                return (
                    <ResponsiveContainer width="100%" height={height} minWidth={0}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis
                                dataKey="name"
                                className="text-gray-600 dark:text-gray-400"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis className="text-gray-600 dark:text-gray-400" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#374151' }}
                            />
                            <Legend />
                            <Bar dataKey="Staff" fill="#3b82f6" name="เจ้าหน้าที่" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Staff" position="top" />
                            </Bar>
                            <Bar dataKey="Service" fill="#10b981" name="ผู้ใช้บริการ" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Service" position="top" />
                            </Bar>
                            <Bar dataKey="Restroom" fill="#f59e0b" name="ห้องน้ำ" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Restroom" position="top" />
                            </Bar>
                            <Bar dataKey="Assistance" fill="#8b5cf6" name="ช่วยเหลือ" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Assistance" position="top" />
                            </Bar>
                            <Bar dataKey="Accident" fill="#ef4444" name="อุบัติเหตุ" radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="Accident" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "trend":
                return (
                    <ResponsiveContainer width="100%" height={height} minWidth={0}>
                        <LineChart
                            data={trendData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                className="text-gray-600 dark:text-gray-400"
                            />
                            <YAxis yAxisId="left" className="text-gray-600 dark:text-gray-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-gray-600 dark:text-gray-400" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                labelFormatter={(date) => new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                            />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="service" stroke="#10b981" name="ผู้ใช้บริการ" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            <Line yAxisId="right" type="monotone" dataKey="accident" stroke="#ef4444" name="อุบัติเหตุ" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "comparison-accident":
                return (
                    <ResponsiveContainer width="100%" height={height} minWidth={0}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis
                                dataKey="name"
                                className="text-gray-600 dark:text-gray-400"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis className="text-gray-600 dark:text-gray-400" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#374151' }}
                            />
                            <Legend />
                            <Bar dataKey="AccidentYesterday" fill="#9ca3af" name={`อุบัติเหตุ (${yesterdayLabel})`} radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="AccidentYesterday" position="top" />
                            </Bar>
                            <Bar dataKey="AccidentToday" fill="#ef4444" name={`อุบัติเหตุ (${todayLabel})`} radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="AccidentToday" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "comparison-fatality":
                return (
                    <ResponsiveContainer width="100%" height={height} minWidth={0}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                            <XAxis
                                dataKey="name"
                                className="text-gray-600 dark:text-gray-400"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                            />
                            <YAxis className="text-gray-600 dark:text-gray-400" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#374151' }}
                            />
                            <Legend />
                            <Bar dataKey="FatalityYesterday" fill="#9ca3af" name={`เสียชีวิต (${yesterdayLabel})`} radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="FatalityYesterday" position="top" />
                            </Bar>
                            <Bar dataKey="FatalityToday" fill="#000000" name={`เสียชีวิต (${todayLabel})`} radius={[4, 4, 0, 0]}>
                                <LabelList dataKey="FatalityToday" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Overview Chart */}
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 cursor-pointer hover:shadow-xl"
                    onClick={() => setExpandedChart("overview")}
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex justify-between items-center">
                        ภาพรวมสถิติแยกตามหน่วยงาน
                        <span className="text-xs text-gray-400 font-normal">(คลิกเพื่อขยาย)</span>
                    </h3>
                    <div className="h-[400px] w-full min-h-[400px]">
                        {renderChart("overview")}
                    </div>
                </div>

                {/* Trend Chart */}
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 cursor-pointer hover:shadow-xl"
                    onClick={() => setExpandedChart("trend")}
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex justify-between items-center">
                        แนวโน้มผู้ใช้บริการและอุบัติเหตุรายวัน
                        <span className="text-xs text-gray-400 font-normal">(คลิกเพื่อขยาย)</span>
                    </h3>
                    <div className="h-[400px] w-full min-h-[400px]">
                        {renderChart("trend")}
                    </div>
                </div>

                {/* Comparison Accident Chart */}
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 cursor-pointer hover:shadow-xl"
                    onClick={() => setExpandedChart("comparison-accident")}
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex justify-between items-start">
                        <div>
                            เปรียบเทียบอุบัติเหตุ ({yesterdayLabel} vs {todayLabel})
                            <div className="text-sm font-normal mt-1 flex gap-2">
                                <span className={accidentDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                    ปี: {accidentDiffPercent > 0 ? "+" : ""}{accidentDiffPercent.toFixed(1)}%
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className={dailyAccidentDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                    วัน: {dailyAccidentDiffPercent > 0 ? "+" : ""}{dailyAccidentDiffPercent.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-normal whitespace-nowrap ml-2">(คลิกเพื่อขยาย)</span>
                    </h3>
                    <div className="h-[400px] w-full min-h-[400px]">
                        {renderChart("comparison-accident")}
                    </div>
                </div>

                {/* Comparison Fatality Chart */}
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300 cursor-pointer hover:shadow-xl"
                    onClick={() => setExpandedChart("comparison-fatality")}
                >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex justify-between items-start">
                        <div>
                            เปรียบเทียบผู้เสียชีวิต ({yesterdayLabel} vs {todayLabel})
                            <div className="text-sm font-normal mt-1 flex gap-2">
                                <span className={fatalityDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                    ปี: {fatalityDiffPercent > 0 ? "+" : ""}{fatalityDiffPercent.toFixed(1)}%
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className={dailyFatalityDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                    วัน: {dailyFatalityDiffPercent > 0 ? "+" : ""}{dailyFatalityDiffPercent.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-normal whitespace-nowrap ml-2">(คลิกเพื่อขยาย)</span>
                    </h3>
                    <div className="h-[400px] w-full min-h-[400px]">
                        {renderChart("comparison-fatality")}
                    </div>
                </div>
            </div>

            {/* Expanded Chart Modal */}
            {expandedChart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setExpandedChart(null)}>
                    <div
                        className="bg-white dark:bg-gray-800 w-full max-w-6xl h-[80vh] rounded-2xl p-6 relative shadow-2xl border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setExpandedChart(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                            {expandedChart === "overview" && "ภาพรวมสถิติแยกตามหน่วยงาน"}
                            {expandedChart === "trend" && "แนวโน้มผู้ใช้บริการและอุบัติเหตุรายวัน"}
                            {expandedChart === "comparison-accident" && (
                                <div className="flex items-center gap-4">
                                    <span>เปรียบเทียบอุบัติเหตุ ({yesterdayLabel} vs {todayLabel})</span>
                                    <div className="text-lg font-normal flex gap-3">
                                        <span className={accidentDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                            ปี: {accidentDiffPercent > 0 ? "+" : ""}{accidentDiffPercent.toFixed(1)}%
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span className={dailyAccidentDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                            วัน: {dailyAccidentDiffPercent > 0 ? "+" : ""}{dailyAccidentDiffPercent.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                            {expandedChart === "comparison-fatality" && (
                                <div className="flex items-center gap-4">
                                    <span>เปรียบเทียบผู้เสียชีวิต ({yesterdayLabel} vs {todayLabel})</span>
                                    <div className="text-lg font-normal flex gap-3">
                                        <span className={fatalityDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                            ปี: {fatalityDiffPercent > 0 ? "+" : ""}{fatalityDiffPercent.toFixed(1)}%
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span className={dailyFatalityDiffPercent > 0 ? "text-red-500" : "text-green-500"}>
                                            วัน: {dailyFatalityDiffPercent > 0 ? "+" : ""}{dailyFatalityDiffPercent.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </h3>
                        <div className="w-full h-[calc(100%-4rem)]">
                            {renderChart(expandedChart, true)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
