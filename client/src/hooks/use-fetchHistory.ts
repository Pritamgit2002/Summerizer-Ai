import { getPrompts } from "@/actions/get-history";
import { IPrompt } from "@/models/user"
import { useEffect, useState } from "react";

type History = {
    prompt: IPrompt["prompt"],
    paragraphs: IPrompt["paragraphs"],
    points: IPrompt["points"]
}
export const useFetchHistory = ({ userEmail }: { userEmail: string }) => {
    const [history, setHistory] = useState<History[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const fetchHistoryResults = await getPrompts({ userEmail });
                // if (fetchHistoryResults.success) {
                //     setHistory(fetchHistoryResults.map((prompt: string, index: number) => ({
                //         prompt,
                //         paragraphs: fetchHistoryResults.generatedParagraphs[index],
                //         points: fetchHistoryResults.generatedPoints[index]
                //     })));
                // }

                if(fetchHistoryResults.success){
                        
                }

                console.log("History fetched:", fetchHistoryResults.generatedParagraphs);

            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    },)
}