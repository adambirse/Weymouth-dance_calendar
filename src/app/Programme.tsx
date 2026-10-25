"use client";

import { useMemo, useState } from "react";
import { classKey, items, type ProgrammeItem } from "@/data/programme";
import { days, formatTime, Highlight } from "./shared";
import type { Follows } from "./useFollows";

function matches(item: ProgrammeItem, query: string) {
  if (item.kind !== "event") return false;
  return (
    item.title.toLowerCase().includes(query) ||
    (item.entries ?? []).some((entry) => entry.toLowerCase().includes(query))
  );
}

function FollowButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      className={`follow ${on ? "on" : ""}`}
      onClick={onToggle}
      aria-pressed={on}
      aria-label={on ? "Remove from my timetable" : "Add to my timetable"}
    >
      {on ? "★" : "☆"}
    </button>
  );
}

export default function Programme({ follows, update }: Follows) {
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
            <h2>{d.heading}</h2>
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
                    {follows && (
                      <FollowButton
                        on={follows.includes(classKey(item))}
                        onToggle={() =>
                          update(
                            follows.includes(classKey(item))
                              ? follows.filter((k) => k !== classKey(item))
                              : [...follows, classKey(item)],
                          )
                        }
                      />
                    )}
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
