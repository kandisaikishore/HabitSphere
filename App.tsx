import { useMemo, useState } from "react";
import { toLocalDateKey, addDays, weekDates } from "./dates";
import { currentStreak, longestStreak, weeklyCompletion } from "./streaks";
import { useHabits } from "./useHabits";

type Page = "Dashboard" | "My Habits" | "Calendar" | "Analytics" | "Goals" | "AI Coach" | "Settings";
type Category = "Health" | "Learning" | "Productivity" | "Personal" | "Other";
type HabitMeta = { category: Category; frequency: string; reminder: string; color: string; goal: string };
const NAV: { name: Page; icon: string }[] = [
  { name: "Dashboard", icon: "⌂" }, { name: "My Habits", icon: "▣" }, { name: "Calendar", icon: "▦" },
  { name: "Analytics", icon: "▥" }, { name: "Goals", icon: "◎" }, { name: "AI Coach", icon: "♧" }, { name: "Settings", icon: "⚙" },
];
const EMOJIS = ["🏋️", "📖", "💧", "💻", "🧘", "🌱", "🎯", "✍️", "🚶", "🎨"];
const COLORS = ["#4e75ff", "#22c58b", "#9b67f8", "#f0629b", "#ff773c", "#fbbc3e"];
const DEFAULT_META: Record<string, HabitMeta> = {
  "morning exercise": { category: "Health", frequency: "Daily", reminder: "06:00", color: COLORS[2], goal: "30 minutes" },
  "read a book": { category: "Learning", frequency: "Daily", reminder: "08:00", color: COLORS[3], goal: "10 pages" },
  "drink water": { category: "Health", frequency: "Daily", reminder: "Any time", color: COLORS[0], goal: "8 glasses" },
  "learn java": { category: "Learning", frequency: "Daily", reminder: "21:00", color: COLORS[0], goal: "30 minutes" },
  meditate: { category: "Personal", frequency: "Daily", reminder: "22:00", color: COLORS[4], goal: "10 minutes" },
  "plan tomorrow": { category: "Productivity", frequency: "Daily", reminder: "21:00", color: COLORS[1], goal: "5 minutes" },
};
const defaultMetaFor = (name: string): HabitMeta => DEFAULT_META[name.toLowerCase()] ?? { category: "Health", frequency: "Daily", reminder: "06:00", color: COLORS[0], goal: "" };
const readLocal = (key: string): unknown => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as unknown : {}; } catch { return {}; } };
const readMeta = (): Record<string, HabitMeta> => {
  const value = readLocal("habitsphere:details");
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, HabitMeta> : {};
};
const readGoals = (): string[] => { const value = readLocal("habitsphere:goals"); return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []; };

export default function App() {
  const { habits, logs, addHabit, deleteHabit, toggleDay } = useHabits();
  const today = toLocalDateKey();
  const week = weekDates(today);
  const [page, setPage] = useState<Page>("Dashboard");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("Health");
  const [draftEmoji, setDraftEmoji] = useState("🏋️");
  const [draftColor, setDraftColor] = useState(COLORS[0]);
  const [draftFrequency, setDraftFrequency] = useState("Daily");
  const [draftReminder, setDraftReminder] = useState("06:00");
  const [draftGoal, setDraftGoal] = useState("");
  const [formError, setFormError] = useState("");
  const [metadata, setMetadata] = useState<Record<string, HabitMeta>>(readMeta);
  const [goals, setGoals] = useState<string[]>(readGoals);
  const [newGoal, setNewGoal] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "coach"; text: string }[]>([
    { role: "coach", text: "Hi Sai! 👋 I’m your Habit Coach. I can help you build consistent routines, set realistic goals and celebrate small wins. What would you like help with today?" },
  ]);
  const [notifications, setNotifications] = useState(true);
  const [dark, setDark] = useState(false);

  const datesFor = (habitId: string) => logs.filter((log) => log.habitId === habitId).map((log) => log.date);
  const doneToday = habits.filter((habit) => datesFor(habit.id).includes(today)).length;
  const weeklyAverage = habits.length ? Math.round(habits.reduce((sum, habit) => sum + weeklyCompletion(datesFor(habit.id), week, today), 0) / habits.length) : 0;
  const filtered = useMemo(() => habits.filter((habit) => habit.name.toLowerCase().includes(search.toLowerCase()) && (categoryFilter === "All" || (metadata[habit.id]?.category ?? metadata["name:" + habit.name.toLowerCase()]?.category ?? defaultMetaFor(habit.name).category) === categoryFilter)), [habits, search, categoryFilter, metadata]);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekStats = week.map((date, index) => ({ date, label: labels[index], total: logs.filter((log) => log.date === date).length }));
  const metadataFor = (id: string, name?: string): HabitMeta => metadata[id] ?? (name ? metadata["name:" + name.toLowerCase()] : undefined) ?? (name ? defaultMetaFor(name) : { category: "Health", frequency: "Daily", reminder: "06:00", color: COLORS[0], goal: "" });
  const persistMeta = (next: Record<string, HabitMeta>) => { setMetadata(next); try { localStorage.setItem("habitsphere:details", JSON.stringify(next)); } catch { /* Browser storage can be disabled. */ } };
  const persistGoals = (next: string[]) => { setGoals(next); try { localStorage.setItem("habitsphere:goals", JSON.stringify(next)); } catch { /* Browser storage can be disabled. */ } };

  const openCreate = () => {
    setEditingId(null); setDraftName(""); setDraftCategory("Health"); setDraftEmoji("🏋️"); setDraftColor(COLORS[0]); setDraftFrequency("Daily"); setDraftReminder("06:00"); setDraftGoal(""); setFormError(""); setShowForm(true);
  };
  const openEdit = (id: string) => {
    const habit = habits.find((item) => item.id === id); if (!habit) return;
    const meta = metadataFor(id, habit.name);
    setEditingId(id); setDraftName(habit.name); setDraftEmoji(habit.icon); setDraftCategory(meta.category); setDraftColor(meta.color); setDraftFrequency(meta.frequency); setDraftReminder(meta.reminder); setDraftGoal(meta.goal); setFormError(""); setShowForm(true);
  };
  const saveHabit = () => {
    const name = draftName.trim();
    if (!name) { setFormError("Give your habit a name to get started."); return; }
    const meta: HabitMeta = { category: draftCategory, frequency: draftFrequency, reminder: draftReminder, color: draftColor, goal: draftGoal };
    if (editingId) {
      const current = habits.find((habit) => habit.id === editingId);
      if (current && current.name !== name) { setFormError("To keep its completion history accurate, habit renaming is not available yet."); return; }
      const next = { ...metadata, [editingId]: meta }; delete next["name:" + name.toLowerCase()]; persistMeta(next); setShowForm(false); return;
    }
    const error = addHabit(name, draftEmoji);
    if (error) { setFormError(error); return; }
    persistMeta({ ...metadata, ["name:" + name.toLowerCase()]: meta });
    setShowForm(false); setFormError("");
  };
  const removeHabit = (id: string) => {
    if (!window.confirm("Delete this habit and all of its completion history?")) return;
    const habit = habits.find((item) => item.id === id);
    deleteHabit(id); const next = { ...metadata }; delete next[id]; if (habit) delete next["name:" + habit.name.toLowerCase()]; persistMeta(next);
  };
  const pageAction = (target: Page) => { setShowForm(false); setPage(target); };
  const coachReply = (raw: string) => {
    const value = raw.trim(); if (!value) return;
    const answer = /motivat|consistent|stuck|hard|miss/i.test(value)
      ? "Try making the habit so small it feels easy to start: two minutes is enough. Attach it to a routine you already do, and aim for consistency rather than perfection. A missed day is information, not failure. 🌱"
      : /suggest|habit|idea/i.test(value)
      ? "Here are three gentle starters: drink a glass of water after waking, read two pages after lunch, or take a 10-minute walk after dinner. Choose one that fits your day."
      : /progress|streak|today/i.test(value)
      ? "You have " + doneToday + " of " + habits.length + " habits completed today, with a weekly average of " + weeklyAverage + "%. Pick one small unfinished habit and finish it now. 💪"
      : "Make the cue obvious, the action easy, and the reward immediate. What is one small action you could repeat at the same time each day?";
    setChat((previous) => [...previous, { role: "user", text: value }, { role: "coach", text: answer }]); setChatInput("");
  };

  const renderHabitRows = () => filtered.length ? <ul className="habit-list">{filtered.map((habit) => {
    const completedDates = datesFor(habit.id); const completed = completedDates.includes(today); const streak = currentStreak(completedDates, today);
    const meta = metadataFor(habit.id, habit.name);
    return <li key={habit.id} className="habit-row">
      <div className="habit-emoji" style={{ backgroundColor: meta.color + "1d" }}>{habit.icon}</div>
      <div className="habit-main"><strong>{habit.name}</strong><small>◷ {meta.reminder === "Any time" ? "All day" : meta.reminder} · {meta.category}</small></div>
      <button className={"habit-status " + (completed ? "completed" : "")} onClick={() => toggleDay(habit.id, today)} aria-pressed={completed}>{completed ? "✓ Completed" : "◯ Mark Done"}</button>
      <div className="streak-badge">🔥 Streak<strong>{streak} {streak === 1 ? "day" : "days"}</strong></div>
      <button className="delete" aria-label={"Edit " + habit.name} onClick={() => openEdit(habit.id)} title="Edit habit">⋯</button>
      <button className="delete" aria-label={"Delete " + habit.name} onClick={() => removeHabit(habit.id)} title="Delete habit">×</button>
    </li>;
  })}</ul> : <div className="empty"><div style={{ fontSize: 32, marginBottom: 10 }}>🌱</div><strong>{search ? "No habits match your search" : "Your next chapter starts here"}</strong><p>Add a small habit and build momentum one day at a time.</p><button className="primary-button" onClick={openCreate}>＋ Add your first habit</button></div>;

  const chart = (height = 106) => <div className="chart-bars" style={{ height }}>{weekStats.map((day, index) => <div className="bar-column" key={day.date}><div className={"bar " + (index >= 4 ? "green" : "")} style={{ height: Math.max(8, habits.length ? day.total / habits.length * 75 : 8) + "px" }} title={day.total + " completions"}/><span className="bar-label">{day.label}</span></div>)}</div>;

  const dashboard = <><div className="greeting-row"><section className="hero-banner"><h1>Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, Sai! 👋</h1><p>Consistency today, a better tomorrow.</p></section><section className="quote-card"><p>“Discipline today creates the freedom you want tomorrow.”</p><span>🌿</span></section></div>
    <div className="metrics"><div className="metric-card"><div className="metric-icon">☷</div><div><strong>{habits.length}</strong><small>Total Habits</small></div></div><div className="metric-card"><div className="metric-icon green">✓</div><div><strong>{doneToday}</strong><small>Completed Today</small></div></div><div className="metric-card"><div className="metric-icon orange">🔥</div><div><strong>{Math.max(0, ...habits.map((habit) => currentStreak(datesFor(habit.id), today)))}</strong><small>Current Streak</small></div></div><div className="metric-card"><div className="metric-icon purple">▥</div><div><strong>{weeklyAverage}%</strong><small>Weekly Success</small></div></div></div>
    <div className="dashboard-grid"><section><div className="section-heading"><h2>Today's Habits</h2><span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>{renderHabitRows()}</section>
    <aside className="right-rail"><section className="panel weekly-panel"><div className="section-heading"><h3>Weekly Progress</h3><strong>{weeklyAverage}%</strong></div>{chart()}<p className="panel-sub">Completions across your active habits</p></section>
    <section className="panel coach-panel"><div className="coach-head"><div className="coach-icon">🤖</div><div><h3>AI Coach</h3><p className="panel-sub">Personalized suggestions and motivation.</p></div></div><button className="primary-button full" onClick={() => pageAction("AI Coach")}>Ask AI Coach →</button></section>
    <section className="panel"><h3>Quick Actions</h3><div className="quick-grid"><button className="quick-action" onClick={openCreate}>✣<span>Add Habit</span></button><button className="quick-action" onClick={() => pageAction("Calendar")}>▦<span>View Calendar</span></button><button className="quick-action" onClick={() => pageAction("Analytics")}>▥<span>Analytics</span></button></div></section></aside></div></>;

  const addHabitView = <section className="content-card"><div style={{ textAlign: "center", marginBottom: 25 }}><div className="metric-icon purple" style={{ margin: "0 auto 10px", width: 52, height: 52, fontSize: 26 }}>✚</div><h2 className="section-title" style={{ marginBottom: 5 }}>{editingId ? "Edit Habit" : "Add New Habit"}</h2><p className="panel-sub">Start a new habit and build a better you!</p></div>
    <div className="form-grid"><label className="form-field full-field">Habit Name<input value={draftName} maxLength={40} onChange={(event) => setDraftName(event.target.value)} placeholder="e.g., Morning Exercise"/></label>
    <label className="form-field full-field">Category<select value={draftCategory} onChange={(event) => setDraftCategory(event.target.value as Category)}>{(["Health", "Learning", "Productivity", "Personal", "Other"] as Category[]).map((category) => <option key={category}>{category}</option>)}</select></label>
    <div className="form-field full-field">Icon<div className="choice-row">{EMOJIS.map((emoji) => <button key={emoji} className={"choice " + (draftEmoji === emoji ? "selected" : "")} onClick={() => setDraftEmoji(emoji)} type="button">{emoji}</button>)}</div></div>
    <div className="form-field full-field">Color<div className="choice-row">{COLORS.map((color) => <button aria-label={"Choose " + color} key={color} type="button" className={"color-choice " + (draftColor === color ? "selected" : "")} style={{ background: color }} onClick={() => setDraftColor(color)}/>)}</div></div>
    <div className="form-field">Frequency<div className="choice-row">{["Daily", "Weekly", "Custom"].map((frequency) => <button type="button" key={frequency} className={"choice " + (draftFrequency === frequency ? "selected" : "")} onClick={() => setDraftFrequency(frequency)}>{frequency}</button>)}</div></div>
    <label className="form-field">Reminder Time<select value={draftReminder} onChange={(event) => setDraftReminder(event.target.value)}>{["06:00", "08:00", "10:00", "12:00", "18:00", "21:00", "Any time"].map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
    <label className="form-field full-field">Goal (optional)<input value={draftGoal} onChange={(event) => setDraftGoal(event.target.value)} placeholder="e.g., 30 minutes"/></label></div>
    {formError && <p className="error" role="alert">{formError}</p>}<div className="page-actions"><button className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" onClick={saveHabit}>{editingId ? "Save Changes" : "Create Habit"}</button></div></section>;

  const analytics = <><h2 className="section-title">Your Progress, In Focus</h2><div className="metrics"><div className="metric-card"><div className="metric-icon">☷</div><div><strong>{habits.length}</strong><small>Total Habits</small></div></div><div className="metric-card"><div className="metric-icon green">✓</div><div><strong>{doneToday}</strong><small>Completed Today</small></div></div><div className="metric-card"><div className="metric-icon orange">🔥</div><div><strong>{Math.max(0, ...habits.map((habit) => longestStreak(datesFor(habit.id))))}</strong><small>Longest Streak</small></div></div><div className="metric-card"><div className="metric-icon purple">↗</div><div><strong>{weeklyAverage}%</strong><small>Completion Rate</small></div></div></div>
    <div className="analytics-grid"><section className="panel"><div className="section-heading"><h3>Completion Rate</h3><strong style={{ fontSize: 25 }}>{weeklyAverage}%</strong></div>{chart(145)}<p className="panel-sub">Based on your current week's recorded activity.</p></section><section className="panel"><h3>Habit Categories</h3><div className="donut-wrap"><div className="donut"><div className="donut-center">{habits.length}<small>Total Habits</small></div></div><div className="legend">{(["Health", "Learning", "Productivity", "Personal", "Other"] as Category[]).map((category, index) => { const count = habits.filter((habit) => metadataFor(habit.id, habit.name).category === category).length; return <div className="legend-item" key={category}><span className="legend-name"><i className="legend-dot" style={{ background: COLORS[index] }}/>{category}</span><strong>{habits.length ? Math.round(count / habits.length * 100) : 0}%</strong></div>; })}</div></div></section><section className="panel"><h3>Streak Stats</h3><div className="metrics" style={{ gridTemplateColumns: "1fr 1fr", margin: 0 }}><div><strong style={{ fontSize: 23 }}>{Math.max(0, ...habits.map((habit) => longestStreak(datesFor(habit.id))))}</strong><p className="panel-sub">🔥 Longest Streak</p></div><div><strong style={{ fontSize: 23 }}>{Math.max(0, ...habits.map((habit) => currentStreak(datesFor(habit.id), today)))}</strong><p className="panel-sub">🏆 Current Streak</p></div></div></section><section className="panel"><h3>Completion Heatmap · Last 90 days</h3><div className="heatmap">{Array.from({ length: 90 }, (_, index) => { const date = addDays(today, index - 89); const count = logs.filter((log) => log.date === date).length; const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / Math.max(1, habits.length) * 4)); return <span title={date + ": " + count + " completions"} key={date} className={"heat-cell " + (level ? "level-" + level : "")}/>; })}</div></section></div></>;

  const calendarView = <section className="content-card"><h2 className="section-title">Habit Calendar</h2><p className="panel-sub" style={{ marginBottom: 18 }}>Your recent activity at a glance. Green squares mark days with completed habits.</p><div className="heatmap" style={{ gridTemplateColumns: "repeat(13, minmax(0,1fr))" }}>{Array.from({ length: 91 }, (_, index) => { const date = addDays(today, index - 90); const count = logs.filter((log) => log.date === date).length; const level = count === 0 ? 0 : Math.min(4, Math.ceil(count / Math.max(1, habits.length) * 4)); return <span key={date} title={date + ": " + count + " completions"} className={"heat-cell " + (level ? "level-" + level : "")}/>; })}</div><div className="section-heading" style={{ marginTop: 25 }}><h2>Today's habits</h2><span>{today}</span></div>{renderHabitRows()}</section>;

  const goalsView = <><h2 className="section-title">Small goals. Big changes.</h2><section className="content-card"><form className="add-row" onSubmit={(event) => { event.preventDefault(); if (!newGoal.trim()) return; persistGoals([...goals, newGoal.trim()]); setNewGoal(""); }}><input value={newGoal} onChange={(event) => setNewGoal(event.target.value)} placeholder="e.g., Read 10 pages every day" aria-label="New goal"/><button>Add goal</button></form><div className="settings-list" style={{ marginTop: 16 }}>{goals.length ? goals.map((goal, index) => <div className="setting-row" key={goal + index}><div><strong>🎯 {goal}</strong><p>One step at a time — you've got this.</p></div><button className="delete" onClick={() => persistGoals(goals.filter((_, i) => i !== index))}>✕</button></div>) : <p className="empty">No goals yet. Add one meaningful target and make it actionable.</p>}</div></section></>;

  const coachView = <section className="content-card"><div className="coach-head"><div className="coach-icon">🤖</div><div><h2 className="section-title" style={{ margin: 0 }}>AI Habit Coach</h2><p className="panel-sub">Friendly ideas based on your habit journey</p></div></div><div className="chat-area" aria-live="polite">{chat.map((message, index) => <div className={"chat-message " + (message.role === "user" ? "user" : "")} key={index}>{message.text}</div>)}</div><div className="filters" style={{ marginTop: 18 }}>{["Suggest a habit", "Motivate me", "Track my progress"].map((suggestion) => <button className="filter-button" key={suggestion} onClick={() => coachReply(suggestion)}>{suggestion}</button>)}</div><form className="chat-compose" onSubmit={(event) => { event.preventDefault(); coachReply(chatInput); }}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Type a message…" aria-label="Message AI Coach"/><button className="primary-button">➤</button></form><p className="panel-sub" style={{ marginTop: 10 }}>Coach replies are generated locally in this demo; no external AI service is connected.</p></section>;

  const settingsView = <section className="content-card"><h2 className="section-title">Profile & Settings</h2><div className="coach-head"><div className="avatar" style={{ width: 48, height: 48 }}>S</div><div><strong>Sai Kishore</strong><p className="panel-sub">Build better habits, one day at a time.</p></div></div><div className="settings-list"><div className="setting-row"><div><strong>Notifications</strong><p>Habit reminders and gentle nudges</p></div><input className="toggle-switch" type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} aria-label="Notifications"/></div><div className="setting-row"><div><strong>Theme</strong><p>Switch the app's appearance</p></div><button className="secondary-button" onClick={() => { setDark(!dark); document.documentElement.dataset.theme = dark ? "light" : "dark"; }}>{dark ? "Dark" : "Light"} ↔</button></div><div className="setting-row"><div><strong>Data & Backup</strong><p>Your habits are stored locally in this browser.</p></div><button className="secondary-button" onClick={() => { const blob = new Blob([JSON.stringify({ habits, logs, metadata, goals }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "habitsphere-backup.json"; anchor.click(); URL.revokeObjectURL(url); }}>Export data</button></div><div className="setting-row"><div><strong>About HabitSphere</strong><p>Small Habits · Big Changes</p></div><span>v1.0</span></div></div></section>;

  let content = dashboard;
  if (showForm) content = addHabitView;
  else if (page === "My Habits") content = <><div className="section-heading"><h2 className="section-title" style={{ margin: 0 }}>My Habits</h2><button className="primary-button" onClick={openCreate}>＋ Add Habit</button></div><div className="filters" style={{ marginTop: 16 }}>{["All", "Health", "Learning", "Productivity", "Personal", "Other"].map((category) => <button key={category} className={"filter-button " + (categoryFilter === category ? "active" : "")} onClick={() => setCategoryFilter(category)}>{category}</button>)}</div>{renderHabitRows()}</>;
  else if (page === "Calendar") content = calendarView;
  else if (page === "Analytics") content = analytics;
  else if (page === "Goals") content = goalsView;
  else if (page === "AI Coach") content = coachView;
  else if (page === "Settings") content = settingsView;

  return <div className="app-shell" data-theme={dark ? "dark" : "light"}>
    <aside className="sidebar"><div className="brand"><span className="brand-mark">✥</span>HabitSphere</div><nav className="nav" aria-label="Main navigation">{NAV.map((item) => <button key={item.name} className={"nav-button " + (page === item.name && !showForm ? "active" : "")} onClick={() => pageAction(item.name)}><span className="nav-icon">{item.icon}</span>{item.name}</button>)}</nav><div className="sidebar-note"><span className="leaf">🌿</span><strong>Small Habits<br/>Big Changes</strong><p>“A better you<br/>every day.”</p></div></aside>
    <main className="main-area"><header className="topbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search habits…" aria-label="Search habits"/></label><div className="top-actions"><button className="icon-button" title={notifications ? "Notifications enabled" : "Notifications disabled"} onClick={() => setNotifications(!notifications)}>♧</button><div className="profile"><span className="avatar">S</span><span className="profile-copy">Sai Kishore<small>Keep going! 💪</small></span></div></div></header>{content}</main>
    <nav className="mobile-nav" aria-label="Mobile navigation">{[{ name: "Dashboard" as Page, icon: "⌂" }, { name: "My Habits" as Page, icon: "▣" }, { name: "Calendar" as Page, icon: "▦" }, { name: "Analytics" as Page, icon: "▥" }, { name: "Settings" as Page, icon: "⚙" }].map((item) => <button key={item.name} className={page === item.name && !showForm ? "active" : ""} onClick={() => pageAction(item.name)}><span>{item.icon}</span>{item.name === "Dashboard" ? "Home" : item.name === "My Habits" ? "Habits" : item.name}</button>)}<button onClick={openCreate}><span>＋</span>Add</button></nav>
  </div>;
}
