import React, { useState } from 'react';

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditStart = (expense) => {
    setEditingId(expense.id);
    setEditForm({ ...expense });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditSave = (expenseId) => {
    onEditExpense(expenseId, {
      description: editForm.description,
      amount: parseFloat(editForm.amount),
      category: editForm.category,
    });
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="list-container">
      <h2>Expense History</h2>
      {expenses.length === 0 ? (
        <p className="no-expenses">No expenses recorded yet. Add one to get started!</p>
      ) : (
        <ul className="expenses-list">
          {expenses.map(expense => (
            <li key={expense.id} className="expense-item">
              {editingId === expense.id ? (
                <div className="edit-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                      placeholder="Amount"
                    />
                  </div>
                  <div className="edit-buttons">
                    <button className="save-btn" onClick={() => handleEditSave(expense.id)}>Save</button>
                    <button className="cancel-btn" onClick={handleEditCancel}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="expense-header">
                    <div>
                      <span className="expense-description">{expense.description}</span>
                      <span className="expense-category">{expense.category || 'Other'}</span>
                      <span className="expense-date">{expense.date}</span>
                    </div>
                    <span className="expense-amount">₨{expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="expense-details">
                    <span className="paid-by">Paid by: <strong>{expense.payer}</strong></span>
                    <span className="split-between">
                      Split among: <strong>{expense.involvedRoommates.join(', ')}</strong>
                    </span>
                  </div>
                  <div className="expense-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditStart(expense)}
                      title="Edit expense"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDeleteExpense(expense.id)}
                      title="Delete expense"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;