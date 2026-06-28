import type { Record_ } from "./persistence";

export function peakOf(records: Record_[]): number {
  return records.reduce((m, r) => Math.max(m, r.value), 0);
}

export interface Food {
  rank: number;
  dd: number;
  name: string;
  emoji: string;
  xp: number;
  gold?: boolean;
}

export const FOODS: Food[] = [
  { rank: 1, dd: -10, name: "ドッグフード", emoji: "🥫", xp: 50 },
  { rank: 2, dd: -20, name: "チキン", emoji: "🍗", xp: 120 },
  { rank: 3, dd: -30, name: "ステーキ", emoji: "🥩", xp: 250 },
  { rank: 4, dd: -40, name: "黄金の骨", emoji: "🦴", xp: 500, gold: true },
];

export type Weather = "sunny" | "cloudy" | "rain" | "rain2" | "storm";
export type Mood = "happy" | "normal" | "down" | "cold";

export interface CrashState {
  dd: number;
  level: number;
  weather: Weather;
  mood: Mood;
  food: Food | null;
  bubble: string | null;
  title: string;
}

export function crashState(value: number, peak: number): CrashState {
  const dd = peak > 0 ? ((value - peak) / peak) * 100 : 0;
  if (dd > -10) return { dd, level: 0, weather: "sunny", mood: "happy", food: null, bubble: null, title: "" };
  if (dd > -20) return { dd, level: 1, weather: "cloudy", mood: "normal", food: FOODS[0], bubble: "おなか…すいたかもワン？", title: "ちょっと小腹がすいたみたい" };
  if (dd > -30) return { dd, level: 2, weather: "rain", mood: "down", food: FOODS[1], bubble: "おなかすいたワン…", title: "おなかが空いています" };
  if (dd > -40) return { dd, level: 3, weather: "rain2", mood: "down", food: FOODS[2], bubble: "ごはん、まだかなワン…", title: "とてもおなかが空いています" };
  return { dd, level: 4, weather: "storm", mood: "cold", food: FOODS[3], bubble: "きんきゅう ごはんチャンスだワン！", title: "🚨 緊急ごはんイベント発生！" };
}

export const THANKS = [
  "ありがとうワン！", "元気になったワン！", "もっと大きくなるワン！",
  "ごちそう最高ワン！", "げんき100ばいワン！", "また食べたいワン！",
  "しあわせワンッ！", "つよくなった気がするワン！",
];

export const pickThanks = () => THANKS[Math.floor(Math.random() * THANKS.length)];

export const xpLevel = (xp: number) => Math.floor(xp / 300) + 1;
export const xpInLevel = (xp: number) => xp % 300;
