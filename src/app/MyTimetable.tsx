"use client";

import { useMemo, useState } from "react";
import { classKey, entryNames, items, performers } from "@/data/programme";
import { days, formatTime } from "./shared";
import type { Follows } from "./useFollows";

const events = items.filter((item) => item.kind === "event");
const eventsByKey = new Map(events.map((item) => [classKey(item), item]));
const dayLabels = new Map(days.map((d) => [d.date, d.label]));

type Suggestion = { key: string; label: string; tag: string };

const allSuggestions: Suggestion[] = [
  ...performers.map((p) => ({ key: p.name, label: p.name, tag: p.kind === "group" ? "group" : "" })),
  ...events.map((item) => ({
    key: classKey(item),
    label: item.title,
    tag: `${dayLabels.get(item.date)} ${formatTime(item.time)}`,
  })),
];

function chipLabel(key: string) {
  const item = eventsByKey.get(key);
  return item ? `${item.title} (${dayLabels.get(item.date)})` : key;
}

export default function MyTimetable({ follows, update }: Follows) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const followed = useMemo(() => new Set(follows ?? []), [follows]);

  const suggestions = query
    ? allSuggestions
        .filter((s) => !followed.has(s.key) && s.label.toLowerCase().includes(query))
        .slice(0, 10)
    : [];

  const classes = useMemo(
    () =>
      events
        .map((item) => {
          const wholeClass = followed.has(classKey(item));
          const numbered = (item.entries ?? []).map((entry, i) => ({
            entry,
            number: i + 1,
            hit: entryNames(item, entry).some((name) => followed.has(name)),
          }));
          return { item, wholeClass, entries: wholeClass ? numbered : numbered.filter((e) => e.hit) };
        })
        .filter(({ entries, wholeClass }) => wholeClass || entries.length > 0),
    [followed],
  );

  function add(key: string) {
    update([...(follows ?? []), key]);
    setSearch("");
  }

  if (follows === null) return <p className="count">Loading your timetable…</p>;

  return (
    <>
      <div className="picker">
        <input
          type="search"
          placeholder="Add a dancer, group or class"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s.key}>
                <button onClick={() => add(s.key)}>
                  {s.label}
                  {s.tag && <span className="tag">{s.tag}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        {query && suggestions.length === 0 && (
          <p className="count">Nothing matches “{search}”.</p>
        )}
      </div>

      {follows.length > 0 && (
        <div className="chips">
          {follows.map((key) => (
            <button
              key={key}
              className="chip"
              onClick={() => update(follows.filter((k) => k !== key))}
              aria-label={`Remove ${chipLabel(key)}`}
            >
              {chipLabel(key)} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {follows.length === 0 && (
        <p className="count">
          Add the dancers, groups and classes you want to watch, and they will appear here in
          time order. You can also tap ☆ on any class in the programme.
        </p>
      )}

      {days.map((d) => {
        const dayClasses = classes.filter(({ item }) => item.date === d.date);
        if (dayClasses.length === 0) return null;
        return (
          <section key={d.date}>
            <h2>{d.heading}</h2>
            {dayClasses.map(({ item, wholeClass, entries }) => {
              const clashes = dayClasses.filter(
                (other) => other.item.id !== item.id && other.item.time === item.time,
              );
              const hits = entries.filter((e) => e.hit);
              return (
                <article key={item.id} className="event">
                  <header>
                    <span className="time">{formatTime(item.time)}</span>
                    <h3>{item.title}</h3>
                  </header>
                  <ol>
                    {entries.map(({ entry, number, hit }) => (
                      <li key={number} value={number} className={hit ? "hit" : ""}>
                        {entry}
                      </li>
                    ))}
                  </ol>
                  {hits.length > 0 && (
                    <p className="meta">
                      Running order: {hits.map((e) => e.number).join(", ")} of{" "}
                      {item.entries?.length}
                    </p>
                  )}
                  {wholeClass && (
                    <button className="link meta" onClick={() => update(follows.filter((k) => k !== classKey(item)))}>
                      Remove class
                    </button>
                  )}
                  {clashes.length > 0 && (
                    <p className="clash">
                      Same start time as {clashes.map((c) => c.item.title).join(" and ")}
                    </p>
                  )}
                </article>
              );
            })}
          </section>
        );
      })}
    </>
  );
}
