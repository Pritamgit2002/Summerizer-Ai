'use server'
import { mongodb } from '@/utils/mongodb';
import { userCollectionName } from '@/models/user';

type Input = {
    userEmail: string;
}

type Output = {
    success: boolean;
    text?: string[];
    generatedParagraphs?: string[];
    generatedPoints?: string[];
    message: string;
    name?: string;
    email?: string;
    avatar?: string;
}

export async function getPrompts({ userEmail }: Input): Promise<Output> {

    try {
        await mongodb.connect();
        const user = await mongodb.collection(userCollectionName).findOne({ email: userEmail });
        console.log("User document found:", user);
        if(!user){
            return { success: false, message: 'User not found' };
        }
        return {
            success: true,
            text: user.prompt,
            generatedParagraphs:user.paragraphs,
            generatedPoints: user.points,
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
