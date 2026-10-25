import programme from "./programme.json";

export type ProgrammeItem = {
  id: number;
  date: string;
  time: string | null;
  kind: "event" | "note";
  title: string;
  page: number;
  group?: boolean;
  entries?: string[];
};

export const items = programme as ProgrammeItem[];
