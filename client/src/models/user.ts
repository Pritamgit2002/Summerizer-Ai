export type IPrompt = {
    text: string;
    // paragraphs: string;
    // points: string;
}
export type IUser = {
    _id: string;
    email: string;
    avatar: string;
    name: string;
    prompts?: IPrompt[];
}

export const userCollectionName = "users";