"use client";

import { useEffect, useState } from "react";
import MyTimetable from "./MyTimetable";
import Programme from "./Programme";
import { useFollows } from "./useFollows";

type View = "programme" | "mine";
const VIEW_KEY = "view";

export default function Home() {
  const [view, setView] = useState<View>("programme");
  const follows = useFollows();

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === "mine") setView("mine");
    } catch {}
  }, []);

  function choose(next: View) {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
  }

  return (
    <>
      <div className="views">
        <button className={view === "programme" ? "active" : ""} onClick={() => choose("programme")}>
          Programme
        </button>
        <button className={view === "mine" ? "active" : ""} onClick={() => choose("mine")}>
          My timetable
        </button>
      </div>
      {view === "programme" ? <Programme {...follows} /> : <MyTimetable {...follows} />}
    </>
  );
}
