import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./App.css";

const categories = ["Food", "Travel", "Shopping", "Bills", "Other"];

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [filterMonth, setFilterMonth] = useState("All");

  const [form, setForm] = useState({
    id: null,
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: ""
  });

  // Load data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions"));
    if (stored) setTransactions(stored);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.date) return;

    const newTransaction = {
      ...form,
      amount: Number(form.amount)
    };

    if (form.id) {
      setTransactions(
        transactions.map((t) =>
          t.id === form.id ? newTransaction : t
        )
      );
    } else {
      setTransactions([
        ...transactions,
        { ...newTransaction, id: Date.now() }
      ]);
    }

    setForm({
      id: null,
      title: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: ""
    });
  };

  const handleEdit = (t) => {
    setForm(t);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filtered = transactions.filter((t) => {
    if (filterMonth === "All") return true;
    const month = new Date(t.date).toLocaleString("default", {
      month: "long"
    });
    return month === filterMonth;
  });

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const chartData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h1>Expense Tracker</h1>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* FILTER */}
      <div className="filter">
        <select onChange={(e) => setFilterMonth(e.target.value)}>
          <option>All</option>
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i}>
              {new Date(0, i).toLocaleString("default", {
                month: "long"
              })}
            </option>
          ))}
        </select>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit">
          {form.id ? "Update" : "Add"}
        </button>
      </form>

      {/* SUMMARY */}
      <div className="card summary">
        <h3>Income: ₹{income}</h3>
        <h3>Expense: ₹{expense}</h3>
        <h3>Balance: ₹{income - expense}</h3>
      </div>

      {/* CHART */}
      <div className="card chart">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={90}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* TRANSACTIONS */}
      <h2>Transactions</h2>

      {filtered.map((t) => (
        <div className="transaction" key={t.id}>
          <div>
            <b>{t.title}</b> - ₹{t.amount}
            <div className="meta">
              {t.category} | {t.type} | {t.date}
            </div>
          </div>

          <div className="actions">
            <button onClick={() => handleEdit(t)}>Edit</button>
            <button onClick={() => handleDelete(t.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}