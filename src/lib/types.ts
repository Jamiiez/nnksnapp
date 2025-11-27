export interface DailyStats {
  date: string; // YYYY-MM-DD
  staffCount: number;
  serviceUsers: number;
  restroomUsers: number;
  assistanceCount: number;
  accidentCount: number;
  fatalityCount: number;
  accidentCount2568: number;
  fatalityCount2568: number;
}

export interface District {
  id: string;
  name: string;
  stats: DailyStats[];
}

export const DISTRICT_NAMES = [
  "สำนักงานทางหลวงที่ 3",
  "แขวงทางหลวงสกลนครที่ 1",
  "แขวงทางหลวงสกลนครที่ 2",
  "แขวงทางหลวงนครพนม",
  "แขวงทางหลวงหนองคาย",
  "แขวงทางหลวงบึงกาฬ",
  "แขวงทางหลวงมุกดาหาร",
];
