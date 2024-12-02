// pages/api/fetchSwapRoute.js
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { inputToken, outputToken, amount, fromAddress, slippage } = req.query;

  try {
    const response = await axios.get(
      `https://gmgn.ai/defi/router/v1/sol/tx/get_swap_route`,
      {
        params: {
          token_in_address: inputToken,
          token_out_address: outputToken,
          in_amount: amount,
          from_address: fromAddress,
          slippage: slippage,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from the API." });
  }
}
