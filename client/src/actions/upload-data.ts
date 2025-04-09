'use server'

import { mongodb } from '@/utils/mongodb';
import { IPrompt, IUser, userCollectionName } from '@/models/user';
import { nanoid } from 'nanoid';

type Input = {
    userEmail: string;
    id:string;
    prompts: IPrompt["prompt"];
    paragraphs:IPrompt["paragraphs"];
    points:IPrompt["points"]
}

type Output = {
    success: boolean;
    message: string;
}

export async function addPromptData(data: Input): Promise<Output> {
    try {
        await mongodb.connect();
        const collection = mongodb.collection(userCollectionName);

        const user = await collection.findOneAndUpdate(
            { email: data.userEmail },
            { $addToSet: { id: nanoid ,prompt: data.prompts, paragraphs: data.paragraphs, points: data.points } },
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