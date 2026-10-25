"use client";

import { useEffect, useState } from "react";

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
export function useFollows() {
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

export type Follows = ReturnType<typeof useFollows>;
