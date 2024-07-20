import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";
import { IUser, userCollectionName } from "@/models/user";
import { mongodb } from "@/utils/mongodb";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET!,
    callbacks: {
        async signIn({ user }) {
            try {
                await mongodb.connect();

                const existingUser = await mongodb
                    .collection(userCollectionName)
                    .findOne({ email: user.email });

                if (!existingUser) {
                    await mongodb.collection<IUser>(userCollectionName).insertOne({
                        _id: nanoid(),
                        email: user.email || "",
                        avatar: user.image || "",
                        name: user.name || "",
                    });
                }

                return true;
            } catch (error) {
                console.error("Error during sign-in callback:", error);
                return false;
            }
        },
    },
});

export { handler as GET, handler as POST };
