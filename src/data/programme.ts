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

export type Performer = { name: string; kind: "dancer" | "group" };

export const items = programme as ProgrammeItem[];

// The dancers in an entry ("Amy Burton, Niamh Bradley"), or the routine name for groups
export function entryNames(item: ProgrammeItem, entry: string) {
  return item.group ? [entry] : entry.split(",").map((name) => name.trim());
}

// Following a whole class is stored as "class:<date> <title>", alongside dancer and group names
export function classKey(item: ProgrammeItem) {
  return `class:${item.date} ${item.title}`;
}

export const performers: Performer[] = (() => {
  const byName = new Map<string, Performer>();
  for (const item of items) {
    for (const entry of item.entries ?? []) {
      for (const name of entryNames(item, entry)) {
        byName.set(name, { name, kind: item.group ? "group" : "dancer" });
      }
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
})();
