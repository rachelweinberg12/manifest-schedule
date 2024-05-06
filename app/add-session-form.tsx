import clsx from "clsx";
import { Ref, forwardRef, useState } from "react";
import { Input } from "./input";

export function AddSessionForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [hosts, setHosts] = useState("");
  const [location, setLocation] = useState("");
  return (
    <form className="flex flex-col gap-4">
      <label>
        Title
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <label>
        Description
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Start Time
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>
      <label>
        Duration
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
        >
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
      </label>
      <label>
        Hosts
        <Input
          value={hosts}
          onChange={(e) => setHosts(e.target.value)}
          required
        />
      </label>
      <label>
        Location
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className={clsx(
          "bg-orange-500 text-white font-bold py-2 px-4 rounded",
          "hover:bg-orange-600 active:bg-orange-700"
        )}
      >
        Add Session
      </button>
    </form>
  );
}
