"use client";

import { useMemo, useState } from "react";
import { items, type ProgrammeItem } from "@/data/programme";

const days = [
  { date: "2026-10-25", label: "Sun 25 Oct" },
  { date: "2026-10-26", label: "Mon 26 Oct" },
];

function formatTime(time: string | null) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${suffix}`;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

function matches(item: ProgrammeItem, query: string) {
  if (item.kind !== "event") return false;
  return (
    item.title.toLowerCase().includes(query) ||
    (item.entries ?? []).some((entry) => entry.toLowerCase().includes(query))
  );
}

export default function Programme() {
  const [search, setSearch] = useState("");
  const [day, setDay] = useState<string | null>(null);
  const query = search.trim().toLowerCase();

  const visible = useMemo(
    () =>
      items.filter(
        (item) => (!day || item.date === day) && (!query || matches(item, query)),
      ),
    [day, query],
  );

  return (
    <>
      <div className="controls">
        <input
          type="search"
          placeholder="Search dancers, groups or classes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        <div className="tabs">
          <button className={day === null ? "active" : ""} onClick={() => setDay(null)}>
            All
          </button>
          {days.map((d) => (
            <button
              key={d.date}
              className={day === d.date ? "active" : ""}
              onClick={() => setDay(d.date)}
            >
              {d.label}
            </button>
          ))}
        </div>
        {query && (
          <p className="count">
            {visible.length} {visible.length === 1 ? "class" : "classes"} found
          </p>
        )}
      </div>

      {days.map((d) => {
        const dayItems = visible.filter((item) => item.date === d.date);
        if (dayItems.length === 0) return null;
        return (
          <section key={d.date}>
            <h2>{d.label}</h2>
            {dayItems.map((item) =>
              item.kind === "note" ? (
                <p key={item.id} className="note">
                  {item.time && <span className="time">{formatTime(item.time)}</span>}
                  {item.title}
                </p>
              ) : (
                <article key={item.id} className="event">
                  <header>
                    <span className="time">{formatTime(item.time)}</span>
                    <h3>
                      <Highlight text={item.title} query={query} />
                    </h3>
                  </header>
                  <ol>
                    {item.entries?.map((entry, i) => (
                      <li
                        key={i}
                        className={query && entry.toLowerCase().includes(query) ? "hit" : ""}
                      >
                        <Highlight text={entry} query={query} />
                      </li>
                    ))}
                  </ol>
                </article>
              ),
            )}
          </section>
        );
      })}

      {visible.length === 0 && <p className="count">Nothing found for “{search}”.</p>}
    </>
  );
}
