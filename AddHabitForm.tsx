import { useState } from "react";

interface Props {
  onAdd: (name: string) => string | null;
}

export function AddHabitForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = onAdd(name);
    setError(result);
    if (!result) setName("");
  };

  return (
    <div className="add-form">
      <div className="add-row">
        <input
          value={name}
          placeholder="New habit, e.g. Drink water"
          aria-label="New habit name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button onClick={submit}>Add</button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </div>
  );
}
