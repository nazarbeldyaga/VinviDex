"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import trxData from "@/data/trxs.json";
import "./TrxHistoryTable.css";

interface Swap {
  timestamp: string;
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut: string;
  txHash: string;
}

interface UserTransactions {
  address: string;
  swaps: Swap[];
}

const TrxHistoryTable: React.FC = () => {
  const { account } = useAuth();
  const [transactions, setTransactions] = useState<Swap[]>([]);

  useEffect(() => {
    // Якщо користувач підключений, шукаємо його транзакції в масиві
    if (account) {
      // Знаходимо користувача за адресою
      const userTransactions = trxData.find(
        (user: UserTransactions) => 
          user.address.toLowerCase() === account.toLowerCase()
      );
      
      // Якщо знайдено користувача, встановлюємо його транзакції
      if (userTransactions) {
        setTransactions(userTransactions.swaps);
      } else {
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }
  }, [account]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const shortenHash = (hash: string) => {
    return hash.substring(0, 6) + "..." + hash.substring(hash.length - 4);
  };

  return (
    <div className="trx-history-container">
      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <table className="trx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Amount In</th>
              <th>Amount Out</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{formatDate(tx.timestamp)}</td>
                <td>{tx.fromToken}</td>
                <td>{tx.toToken}</td>
                <td>{tx.amountIn} {tx.fromToken}</td>
                <td>{tx.amountOut} {tx.toToken}</td>
                <td>
                  <a 
                    href={`https://etherscan.io/tx/${tx.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {shortenHash(tx.txHash)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-transactions">
          {account ? "No transactions found for this wallet." : "Please connect your wallet to view transactions."}
        </p>
      )}
    </div>
  );
};

export default TrxHistoryTable;