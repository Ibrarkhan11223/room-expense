import React, { useState } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const ROOMMATES = ['IBRAHIM', 'TAHA', 'AMJID', 'ADNAN'];
const CATEGORIES = ['Tea', 'Breakfast', 'Lunch', 'Dinner', 'Other'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [deposits, setDeposits] = useState({});
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateBalances = () => {
    const balances = {};
    ROOMMATES.forEach(roommate => {
      balances[roommate] = deposits[roommate] || 0;
    });

    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.involvedRoommates.length;
      expense.involvedRoommates.forEach(roommate => {
        balances[roommate] -= amountPerPerson;
      });
    });

    return balances;
  };

  const handleAddExpense = (newExpense) => {
    const expenseWithDate = {
      ...newExpense,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };
    setExpenses([...expenses, expenseWithDate]);
    setActiveView('history');
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  const handleEditExpense = (expenseId, updatedExpense) => {
    setExpenses(expenses.map(expense =>
      expense.id === expenseId ? { ...expense, ...updatedExpense } : expense
    ));
  };

  const handleAddDeposit = (roommate, amount) => {
    setDeposits(prev => ({
      ...prev,
      [roommate]: (prev[roommate] || 0) + amount,
    }));
    setActiveView('dashboard');
  };

  const balances = calculateBalances();
  const totalExpenses = calculateTotalExpenses();
  const totalDeposits = Object.values(deposits).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="App">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Room Expense</h2>
          <p className="sidebar-subtitle">Tracker</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </button>

          <button
            className={`nav-item ${activeView === 'addExpense' ? 'active' : ''}`}
            onClick={() => setActiveView('addExpense')}
          >
            <span className="nav-icon">💸</span>
            <span className="nav-label">Add Expense</span>
          </button>

          <button
            className={`nav-item ${activeView === 'addDeposit' ? 'active' : ''}`}
            onClick={() => setActiveView('addDeposit')}
          >
            <span className="nav-icon">💰</span>
            <span className="nav-label">Add Deposit</span>
          </button>

          <button
            className={`nav-item ${activeView === 'history' ? 'active' : ''}`}
            onClick={() => setActiveView('history')}
          >
            <span className="nav-icon">📜</span>
            <span className="nav-label">History</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="quick-stats">
            <div className="stat">
              <span className="stat-label">Total</span>
              <span className="stat-value">₨{totalExpenses.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Deposits</span>
              <span className="stat-value">₨{totalDeposits.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="view-container">
              <div className="view-header">
                <h1>Dashboard</h1>
                <p>Overview of all expenses and balances</p>
              </div>

              {/* Overview Cards */}
              <div className="overview-container">
                <div className="overview-card">
                  <h3>Total Expenses</h3>
                  <span className="overview-amount">₨{totalExpenses.toFixed(2)}</span>
                </div>
                <div className="overview-card">
                  <h3>Total Deposits</h3>
                  <span className="overview-amount">₨{totalDeposits.toFixed(2)}</span>
                </div>
                <div className="overview-card">
                  <h3>Remaining Pool</h3>
                  <span className={`overview-amount ${totalDeposits - totalExpenses >= 0 ? 'positive' : 'negative'}`}>
                    ₨{(totalDeposits - totalExpenses).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Balances Section */}
              <div className="balances-container">
                <h2>Balances & Remaining Amounts</h2>
                <div className="balances-grid">
                  {ROOMMATES.map(roommate => {
                    const remaining = balances[roommate];
                    return (
                      <div key={roommate} className="balance-card">
                        <button 
                          className="roommate-name-btn"
                          onClick={() => {
                            setSelectedPerson(roommate);
                            setActiveView('personDetail');
                          }}
                        >
                          {roommate}
                        </button>
                        <div className="balance-info">
                          <div className="balance-row">
                            <span className="balance-label">Deposited:</span>
                            <span className="balance-value">₨{(deposits[roommate] || 0).toFixed(2)}</span>
                          </div>
                          <div className="balance-row">
                            <span className="balance-label">Remaining:</span>
                            <span className={`balance-value ${remaining >= 0 ? 'positive' : 'negative'}`}>
                              ₨{remaining.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Add Expense View */}
          {activeView === 'addExpense' && (
            <div className="view-container">
              <div className="view-header">
                <h1>Add New Expense</h1>
                <p>Track a new spending and split among roommates</p>
              </div>
              <div className="form-wrapper">
                <ExpenseForm
                  roommates={ROOMMATES}
                  categories={CATEGORIES}
                  onAddExpense={handleAddExpense}
                  onAddDeposit={() => {}}
                  formType="expense"
                />
              </div>
            </div>
          )}

          {/* Add Deposit View */}
          {activeView === 'addDeposit' && (
            <div className="view-container">
              <div className="view-header">
                <h1>Add Deposit</h1>
                <p>Add money to the shared pool</p>
              </div>
              <div className="form-wrapper">
                <ExpenseForm
                  roommates={ROOMMATES}
                  categories={CATEGORIES}
                  onAddExpense={() => {}}
                  onAddDeposit={handleAddDeposit}
                  formType="deposit"
                />
              </div>
            </div>
          )}

          {/* History View */}
          {activeView === 'history' && (
            <div className="view-container">
              <div className="view-header">
                <h1>Expense History</h1>
                <p>All recorded transactions</p>
              </div>
              <ExpenseList
                expenses={expenses}
                onDeleteExpense={handleDeleteExpense}
                onEditExpense={handleEditExpense}
              />
            </div>
          )}

          {/* Person Detail View */}
          {activeView === 'personDetail' && selectedPerson && (
            <div className="view-container">
              <div className="view-header">
                <button 
                  className="back-btn"
                  onClick={() => setActiveView('dashboard')}
                >
                  ← Back to Dashboard
                </button>
                <h1>{selectedPerson}'s Transactions</h1>
                <p>View all expenses and deposits for {selectedPerson}</p>
              </div>

              {/* Personal Stats */}
              <div className="overview-container">
                <div className="overview-card">
                  <h3>Total Deposited</h3>
                  <span className="overview-amount">₨{(deposits[selectedPerson] || 0).toFixed(2)}</span>
                </div>
                <div className="overview-card">
                  <h3>Total Spent</h3>
                  <span className="overview-amount">
                    ₨{expenses
                      .filter(exp => exp.involvedRoommates.includes(selectedPerson))
                      .reduce((sum, exp) => sum + (exp.amount / exp.involvedRoommates.length), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="overview-card">
                  <h3>Current Balance</h3>
                  <span className={`overview-amount ${balances[selectedPerson] >= 0 ? 'positive' : 'negative'}`}>
                    ₨{balances[selectedPerson].toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Expenses Involving This Person */}
              <div className="person-detail-section">
                <h2>Expenses Involving {selectedPerson}</h2>
                {expenses.filter(exp => exp.involvedRoommates.includes(selectedPerson) || exp.payer === selectedPerson).length === 0 ? (
                  <p className="no-data">No expenses yet</p>
                ) : (
                  <ul className="expenses-list">
                    {expenses
                      .filter(exp => exp.involvedRoommates.includes(selectedPerson) || exp.payer === selectedPerson)
                      .map(expense => (
                        <li key={expense.id} className="expense-item">
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
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Deposits Made */}
              <div className="person-detail-section">
                <h2>Deposits Made by {selectedPerson}</h2>
                {deposits[selectedPerson] ? (
                  <div className="deposit-item">
                    <div className="deposit-amount">
                      <span className="deposit-label">Total Deposited</span>
                      <span className="deposit-value">₨{deposits[selectedPerson].toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="no-data">No deposits yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;