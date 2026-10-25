"use client";

import { useEffect, useMemo, useState } from "react";
import { entryNames, items, performers } from "@/data/programme";
import { days, formatTime } from "./shared";

const LOCAL_KEY = "my-timetable";

function readLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocal(follows: string[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(follows));
  } catch {}
}

// Followed names are saved to the user's account, or to this device if storage isn't set up
function useFollows() {
  const [follows, setFollows] = useState<string[] | null>(null);
  const [synced, setSynced] = useState(true);

  useEffect(() => {
    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.follows)) {
          setFollows(data.follows);
        } else {
          setSynced(false);
          setFollows(readLocal());
        }
      })
      .catch(() => {
        setSynced(false);
        setFollows(readLocal());
      });
  }, []);

  function update(next: string[]) {
    setFollows(next);
    writeLocal(next);
    if (synced) {
      fetch("/api/timetable", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ follows: next }),
      }).catch(() => {});
    }
  }

  return { follows, update };
}

export default function MyTimetable() {
  const { follows, update } = useFollows();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const followed = useMemo(() => new Set(follows ?? []), [follows]);

  const suggestions = query
    ? performers
        .filter((p) => !followed.has(p.name) && p.name.toLowerCase().includes(query))
        .slice(0, 8)
    : [];

  const classes = useMemo(
    () =>
      items
        .filter((item) => item.kind === "event")
        .map((item) => ({
          item,
          entries: (item.entries ?? [])
            .map((entry, i) => ({ entry, number: i + 1 }))
            .filter(({ entry }) => entryNames(item, entry).some((name) => followed.has(name))),
        }))
        .filter(({ entries }) => entries.length > 0),
    [followed],
  );

  function add(name: string) {
    update([...(follows ?? []), name]);
    setSearch("");
  }

  if (follows === null) return <p className="count">Loading your timetable…</p>;

  return (
    <>
      <div className="picker">
        <input
          type="search"
          placeholder="Add a dancer or group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((p) => (
              <li key={p.name}>
                <button onClick={() => add(p.name)}>
                  {p.name}
                  {p.kind === "group" && <span className="tag">group</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
        {query && suggestions.length === 0 && (
          <p className="count">No dancers or groups match “{search}”.</p>
        )}
      </div>

      {follows.length > 0 && (
        <div className="chips">
          {follows.map((name) => (
            <button
              key={name}
              className="chip"
              onClick={() => update(follows.filter((n) => n !== name))}
              aria-label={`Remove ${name}`}
            >
              {name} <span aria-hidden>×</span>
            </button>
          ))}
        </div>
      )}

      {follows.length === 0 && (
        <p className="count">
          Add the dancers and groups you want to watch, and their classes will appear here in
          time order.
        </p>
      )}

      {days.map((d) => {
        const dayClasses = classes.filter(({ item }) => item.date === d.date);
        if (dayClasses.length === 0) return null;
        return (
          <section key={d.date}>
            <h2>{d.heading}</h2>
            {dayClasses.map(({ item, entries }) => {
              const clashes = dayClasses.filter(
                (other) => other.item.id !== item.id && other.item.time === item.time,
              );
              return (
                <article key={item.id} className="event">
                  <header>
                    <span className="time">{formatTime(item.time)}</span>
                    <h3>{item.title}</h3>
                  </header>
                  <ol>
                    {entries.map(({ entry, number }) => (
                      <li key={number} value={number} className="hit">
                        {entry}
                      </li>
                    ))}
                  </ol>
                  <p className="meta">
                    Running order: {entries.map((e) => e.number).join(", ")} of {item.entries?.length}
                  </p>
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
