import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const csrfToken = generateCsrfToken();
  res.status(200).json({ csrfToken });
}