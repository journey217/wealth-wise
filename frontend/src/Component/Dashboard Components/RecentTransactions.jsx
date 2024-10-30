
import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/RecentTransactions.css';
import { MdDelete } from "react-icons/md";
import { BiSolidPencil } from "react-icons/bi";

const RecentTransactions = ({ updateEditTransaction, openEditModal, openModal, transactions, deleteTransaction }) => {
    // Add state for start date and end date
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteID, setDeleteID] = useState(-1);
    const [recurring, setRecurring] = useState(false);

    // Function to filter and sort transactions based on start and end dates
    const filterTransactions = () => {
        // Filter transactions based on start and end dates
        const filtered = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || transactionDate >= start) &&
                (!end || transactionDate <= end) &&
                (!recurring || transaction.recurring)
            );
        });

        // Sort the filtered transactions by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredTransactions(sorted);
    };

    // UseEffect to automatically filter and sort when transactions, startDate, endDate, or recurring change
    useEffect(() => {
        filterTransactions();
    }, [transactions, startDate, endDate, recurring]);

    const handleEditTransaction = (transaction) => {
        updateEditTransaction(transaction);
        openEditModal();
    };

    const handleDelete = (id) => {
        setDeleteID(id);
        setShowConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        deleteTransaction(deleteID);
        setShowConfirmDelete(false);
    };

    return (
        <>
            <div className="recent-transactions">
                <div className="transactions-header">
                    <h3>Recent Transactions</h3>
                    <button className="add-button" onClick={openModal}>
                        Add Item
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="transactions-filter">
                    <div className="date-input-group">
                        <div className="filter-item">
                            <label className="date-label" htmlFor="start-date">Start:</label>
                            <input
                                type="date"
                                id="start-date"
                                className="filter-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-item">
                            <label className="date-label" htmlFor="end-date">End:</label>
                            <input
                                type="date"
                                id="end-date"
                                className="filter-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="filter-item recurring-filter">
                            <label className="recurring-label" htmlFor="recurring-checkbox">
                                Recurring
                            </label>
                            <input
                                type="checkbox"
                                id="recurring-checkbox"
                                checked={recurring}
                                onChange={(e) => setRecurring(e.target.checked)}
                                className="recurring-checkbox"
                            />
                        </div>
                    </div>
                </div>

                <div className="transactions-list">
                    {filteredTransactions.length > 0 ?
                        <div>
                            {filteredTransactions.map((transaction) => (
                                <div className="transaction" key={transaction.id}>
                                    <span className="icon_button" onClick={() => handleEditTransaction(transaction)}><BiSolidPencil /></span>
                                    <span>{transaction.name}</span>
                                    <span>{"$" + transaction.price}</span>
                                    <span>{transaction.date}</span>
                                    <span>{transaction.recurring ? "Recurring" : ""}</span>
                                    <span className="icon_button" onClick={() => handleDelete(transaction.id)}><MdDelete /></span>
                                </div>
                            ))}
                        </div>
                        : <p style={{ textAlign: "center", marginTop: "100px", color: "black" }}>
                            Looks like you haven't added any transactions yet. <br />
                            Try <span onClick={openModal} style={{ color: "#7984D2", textDecoration: "underline", cursor: "pointer" }}>adding a transaction</span>
                        </p>
                    }
                </div>
            </div>
            {showConfirmDelete &&
                <div onClick={() => setShowConfirmDelete(false)} className={"edit_background"}>
                    <div onClick={e => e.stopPropagation()} className={"confirm_delete_modal"}>
                        <div className={"confirm_delete_modal_text_container"}>
                            <div className={"confirm_delete_modal_text"}>{"Are you sure you want to delete this transaction?"}</div>
                        </div>
                        <div className={"confirm_delete_button_tray"}>
                            <button className={"delete_transaction_button"} onClick={handleConfirmDelete}>Delete</button>
                            <button className={"cancel_delete_button"} onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default RecentTransactions;

