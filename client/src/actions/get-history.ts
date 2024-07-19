'use server'
import { mongodb } from '@/utils/mongodb';
import { IPrompt, userCollectionName } from '@/models/user';

type Input = {
    userEmail: string;
}

type Output = {
    success: boolean;
    text?: string[];
    message: string;
    name?: string;
    email?: string;
    avatar?: string;
}

export async function getPrompts({ userEmail }: Input): Promise<Output> {
    console.log("getPrompts called");
    try {
        await mongodb.connect();
        const collection = mongodb.collection(userCollectionName);

        // Find the user by email
        const user = await collection.findOne({ email: userEmail });

        if (!user) {
            return { success: false, message: 'User not found' };
        }


        // Ensure prompts is an array and extract the text from each prompt
        const texts = Array.isArray(user.prompt) ? user.prompt : [];

        console.log("User document found:", texts);

        return {
            success: true,
            text: texts,
            message: 'Prompts retrieved successfully',
            name: user.name,
            email: user.email,
            avatar: user.avatar
        };
    } catch (error) {
        console.error('Error retrieving user prompts:', error);
        return { success: false, message: 'Error retrieving user prompts' };
    }
}
