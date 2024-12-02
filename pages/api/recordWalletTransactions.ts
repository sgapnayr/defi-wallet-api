import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import corsHandler from "./corsHandler";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await corsHandler(req, res);

  switch (req.method) {
    case "GET":
      return getTransactions(req, res);
    case "POST":
      return createTransaction(req, res);
    default:
      res.status(405).end();
      break;
  }
}

async function getTransactions(req: NextApiRequest, res: NextApiResponse) {
  try {
    const transactions = await prisma.walletTransaction.findMany();
    res.status(200).send(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching transactions." });
  }
}

async function createTransaction(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      fromAddress,
      toAddress,
      tokenInAddress,
      tokenOutAddress,
      amount,
      slippage,
      transactionHash,
    } = req.body;

    if (
      !fromAddress ||
      !toAddress ||
      !tokenInAddress ||
      !tokenOutAddress ||
      !amount ||
      !slippage
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newTransaction = await prisma.walletTransaction.create({
      data: {
        fromAddress,
        toAddress,
        tokenInAddress,
        tokenOutAddress,
        amount: parseFloat(amount),
        slippage: parseFloat(slippage),
        transactionHash: transactionHash || null,
      },
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating transaction." });
  }
}
