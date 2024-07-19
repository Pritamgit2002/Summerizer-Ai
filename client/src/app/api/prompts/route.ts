// pages/api/prompts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getPrompts } from '@/actions/get-history';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const result = await getPrompts();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
