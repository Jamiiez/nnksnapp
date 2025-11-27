import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { District, DailyStats, DISTRICT_NAMES } from "./types";

// Config variables
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

export async function fetchSheetData(): Promise<District[] | null> {
    if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
        console.warn("Google Sheets credentials not found. Using mock data.");
        return null;
    }

    try {
        const serviceAccountAuth = new JWT({
            email: SERVICE_ACCOUNT_EMAIL,
            key: PRIVATE_KEY.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
        await doc.loadInfo();

        const districtsMap = new Map<string, District>();

        // Map full district names to Sheet Tab names
        // Note: These must match exactly with the tabs in your Google Sheet
        const SHEET_MAPPING: { [key: string]: string } = {
            "สำนักงานทางหลวงที่ 3": "สทล.3",
            "แขวงทางหลวงสกลนครที่ 1": "ขท.สกล1",
            "แขวงทางหลวงสกลนครที่ 2": "ขท.สกล2",
            "แขวงทางหลวงนครพนม": "ขท.นครพนม",
            "แขวงทางหลวงหนองคาย": "ขท.หนองคาย",
            "แขวงทางหลวงบึงกาฬ": "ขท.บึงกาฬ",
            "แขวงทางหลวงมุกดาหาร": "ขท.มุกดาหาร",
        };

        // Initialize map and fetch data for each district
        await Promise.all(DISTRICT_NAMES.map(async (name, index) => {
            const id = `district-${index + 1}`;
            const district: District = {
                id,
                name,
                stats: [],
            };
            districtsMap.set(name, district);

            const sheetTitle = SHEET_MAPPING[name];
            if (!sheetTitle) return;

            const sheet = doc.sheetsByTitle[sheetTitle];
            if (!sheet) {
                console.warn(`Sheet with title "${sheetTitle}" not found.`);
                return;
            }

            const rows = await sheet.getRows();

            rows.forEach((row) => {
                const date = row.get("Date");
                // We don't need "District" column anymore as we are in the specific sheet
                const staff = parseInt(row.get("Staff") || "0", 10);
                const service = parseInt(row.get("ServiceUsers") || "0", 10);
                const restroom = parseInt(row.get("Restroom") || "0", 10);
                const assistance = parseInt(row.get("Assistance") || "0", 10);
                const accident = parseInt(row.get("Accidents") || "0", 10);
                const fatalities = parseInt(row.get("Fatalities") || "0", 10);
                const accident2568 = parseInt(row.get("Accidents2568") || "0", 10);
                const fatalities2568 = parseInt(row.get("Fatalities2568") || "0", 10);

                if (date) {
                    district.stats.push({
                        date,
                        staffCount: staff,
                        serviceUsers: service,
                        restroomUsers: restroom,
                        assistanceCount: assistance,
                        accidentCount: accident,
                        fatalityCount: fatalities,
                        accidentCount2568: accident2568,
                        fatalityCount2568: fatalities2568,
                    });
                }
            });
        }));

        // Convert map to array and sort stats by date
        const districts = Array.from(districtsMap.values()).map(d => ({
            ...d,
            stats: d.stats.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }));

        return districts;
    } catch (error) {
        console.error("Error fetching from Google Sheets:", error);
        return null;
    }
}
