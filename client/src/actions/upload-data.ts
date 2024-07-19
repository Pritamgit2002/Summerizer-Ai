'use server'

import { mongodb } from '@/utils/mongodb';
import { IPrompt, IUser, userCollectionName } from '@/models/user';

type Input = {
    userEmail: string;
    // prompts: IPrompt[];
    prompts: IPrompt["text"];
}

type Output = {
    success: boolean;
    message: string;
}

export async function storeQuestion(data: Input): Promise<Output> {
    try {
        await mongodb.connect();
        const collection = mongodb.collection(userCollectionName);

        const user = await collection.findOneAndUpdate(
            { email: data.userEmail },
            { $addToSet: { prompt: data.prompts } },
        );

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, message: 'Prompt added successfully' };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, message: 'Error updating user' };
    }
}