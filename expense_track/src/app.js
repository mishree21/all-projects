import React, { useState } from "react";
import "./style.css";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!title.trim() || !amount) return;

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount)
    };

    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((item) => item.id !== id));
  };

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="container">
      <h1>Expense Tracker 💰</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={addExpense}>Add</button>
      </div>

      <h2>Total: ₹ {total.toFixed(2)}</h2>

      <div className="list">
        {expenses.length === 0 && (
          <p className="empty">No expenses added yet</p>
        )}

        {expenses.map((item) => (
          <div className="card" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <p>₹ {item.amount}</p>
            </div>
            <button className="delete" onClick={() => deleteExpense(item.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


