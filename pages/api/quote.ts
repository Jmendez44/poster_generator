import type { NextApiRequest, NextApiResponse } from 'next'

const API_KEY = process.env.API_NINJAS_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!API_KEY) {
    return res.status(500).json({ error: "API key is not set" });
  }

  try {
    const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      res.status(200).json({ content: data[0].quote, author: data[0].author });
    } else {
      throw new Error('No quote received from API');
    }
  } catch (error) {
    console.error("Error in /api/quote:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: "Failed to fetch quote", details: error.message });
    } else {
      res.status(500).json({ error: "Failed to fetch quote", details: "An unknown error occurred" });
    }
  }
}
