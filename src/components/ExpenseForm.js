import React, { useState } from 'react';

function ExpenseForm({ roommates, categories, onAddExpense, onAddDeposit, formType = 'both' }) {
  const [formMode, setFormMode] = useState(formType === 'both' ? 'expense' : formType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [involved, setInvolved] = useState(
    roommates.reduce((acc, roommate) => {
      acc[roommate] = true;
      return acc;
    }, {})
  );
  const [depositPerson, setDepositPerson] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleCheckboxChange = (roommate) => {
    setInvolved(prev => ({
      ...prev,
      [roommate]: !prev[roommate],
    }));
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();

    if (!description || !amount || !payer) {
      alert('Please fill in all fields');
      return;
    }

    const involvedRoommates = Object.keys(involved).filter(roommate => involved[roommate]);
    if (involvedRoommates.length === 0) {
      alert('Please select at least one roommate to be involved');
      return;
    }

    onAddExpense({
      description,
      amount: parseFloat(amount),
      payer,
      involvedRoommates,
      category,
    });

    setDescription('');
    setAmount('');
    setPayer('');
    setCategory(categories[0]);
    setInvolved(
      roommates.reduce((acc, roommate) => {
        acc[roommate] = true;
        return acc;
      }, {})
    );
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();

    if (!depositPerson || !depositAmount) {
      alert('Please select a person and enter an amount');
      return;
    }

    onAddDeposit(depositPerson, parseFloat(depositAmount));
    setDepositPerson('');
    setDepositAmount('');
  };

  // Show tabs only when formType is 'both'
  const showTabs = formType === 'both';

  return (
    <div className="forms-container">
      {showTabs && (
        <div className="form-tabs">
          <button
            className={`tab-btn ${formMode === 'expense' ? 'active' : ''}`}
            onClick={() => setFormMode('expense')}
          >
            Add Expense
          </button>
          <button
            className={`tab-btn ${formMode === 'deposit' ? 'active' : ''}`}
            onClick={() => setFormMode('deposit')}
          >
            Add Deposit
          </button>
        </div>
      )}

      {(formMode === 'expense' || formType === 'expense') && (
        <div className="form-container">
          {!showTabs && <h2>Add New Expense</h2>}
          <form onSubmit={handleExpenseSubmit}>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                type="text"
                placeholder="e.g., Grocery, Restaurant"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="payer">Who Paid?</label>
              <select
                id="payer"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                <option value="">-- Select Payer --</option>
                {roommates.map(roommate => (
                  <option key={roommate} value={roommate}>
                    {roommate}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Who was Involved?</label>
              <div className="checkboxes-container">
                {roommates.map(roommate => (
                  <label key={roommate} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={involved[roommate]}
                      onChange={() => handleCheckboxChange(roommate)}
                    />
                    {roommate}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-btn">Add Expense</button>
          </form>
        </div>
      )}

      {(formMode === 'deposit' || formType === 'deposit') && (
        <div className="form-container">
          {!showTabs && <h2>Add Deposit</h2>}
          <form onSubmit={handleDepositSubmit}>
            <div className="form-group">
              <label htmlFor="depositPerson">Select Person</label>
              <select
                id="depositPerson"
                value={depositPerson}
                onChange={(e) => setDepositPerson(e.target.value)}
              >
                <option value="">-- Select Person --</option>
                {roommates.map(roommate => (
                  <option key={roommate} value={roommate}>
                    {roommate}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="depositAmount">Deposit Amount</label>
              <input
                id="depositAmount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn">Add Deposit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ExpenseForm;