import { District, DailyStats, DISTRICT_NAMES } from "./types";

const START_DATE = new Date("2025-12-29"); // Dec 29, 2568 (2025)
const DAYS_TO_GENERATE = 7;

function generateDailyStats(startDate: Date, days: number): DailyStats[] {
    const stats: DailyStats[] = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        stats.push({
            date: dateStr,
            staffCount: Math.floor(Math.random() * 50) + 100, // 100-150
            serviceUsers: Math.floor(Math.random() * 200) + 50, // 50-250
            restroomUsers: Math.floor(Math.random() * 300) + 100, // 100-400
            assistanceCount: Math.floor(Math.random() * 20), // 0-20
            accidentCount: Math.floor(Math.random() * 5), // 0-5
            fatalityCount: Math.floor(Math.random() * 2), // 0-2
            accidentCount2568: Math.floor(Math.random() * 5), // 0-5
            fatalityCount2568: Math.floor(Math.random() * 2), // 0-2
        });
    }
    return stats;
}

export const mockDistricts: District[] = DISTRICT_NAMES.map((name, index) => ({
    id: `district-${index + 1}`,
    name,
    stats: generateDailyStats(START_DATE, DAYS_TO_GENERATE),
}));
