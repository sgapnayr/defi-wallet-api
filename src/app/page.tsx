"use client";

import { WalletTransaction } from "@prisma/client";
import axios from "axios";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [formData, setFormData] = useState({
    fromAddress: "",
    toAddress: "",
    tokenInAddress: "",
    tokenOutAddress: "",
    amount: "",
    slippage: "",
    transactionHash: "",
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/recordWalletTransactions");
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/recordWalletTransactions", formData);
      toast.success("Transaction recorded successfully!");
      setFormData({
        fromAddress: "",
        toAddress: "",
        tokenInAddress: "",
        tokenOutAddress: "",
        amount: "",
        slippage: "",
        transactionHash: "",
      });
      fetchTransactions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to record transaction.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-8">
      {/* React Hot Toast Component */}
      <Toaster />

      <h1 className="text-2xl font-bold mb-4">Wallet Transactions</h1>

      {/* Form to Record a Transaction */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fromAddress"
          placeholder="From Address"
          value={formData.fromAddress}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="toAddress"
          placeholder="To Address"
          value={formData.toAddress}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="tokenInAddress"
          placeholder="Input Token Address"
          value={formData.tokenInAddress}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="tokenOutAddress"
          placeholder="Output Token Address"
          value={formData.tokenOutAddress}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="slippage"
          placeholder="Slippage"
          value={formData.slippage}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          name="transactionHash"
          placeholder="Transaction Hash (Optional)"
          value={formData.transactionHash}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Record Transaction
        </button>
      </form>

      {/* Display Transactions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold">Transaction History</h2>
        {transactions.length > 0 ? (
          <ul className="space-y-2">
            {transactions.map((tx, index) => (
              <li key={index} className="border p-4 rounded">
                <p>
                  <strong>From:</strong> {tx.fromAddress}
                </p>
                <p>
                  <strong>To:</strong> {tx.toAddress}
                </p>
                <p>
                  <strong>Token In:</strong> {tx.tokenInAddress}
                </p>
                <p>
                  <strong>Token Out:</strong> {tx.tokenOutAddress}
                </p>
                <p>
                  <strong>Amount:</strong> {tx.amount}
                </p>
                <p>
                  <strong>Slippage:</strong> {tx.slippage}
                </p>
                {tx.transactionHash && (
                  <p>
                    <strong>Transaction Hash:</strong> {tx.transactionHash}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions recorded yet.</p>
        )}
      </div>
    </div>
  );
}
