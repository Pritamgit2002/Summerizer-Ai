"use client";
import toast, { Toaster } from "react-hot-toast";
import { GrPowerReset } from "react-icons/gr";
import { useState, ChangeEvent } from "react";
import { FaCopy, FaFileDownload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useSession } from "next-auth/react";
import { addPromptData } from "@/actions/upload-data";

export const Summarizer = () => {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState<string>("");
  const [paragraphSummary, setParagraphSummary] = useState<string>("");
  const [bulletPointsSummary, setBulletPointsSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("paragraph");

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const fetchResponse = async () => {
    if (!prompt) {
      // alert("Enter Text to Summarize");
      toast.error("Enter Text to Summarize");
      return;
    }
    setLoading(true);
    try {
      const resParagraph = await fetch(
        "https://summerizer-server.onrender.com/api/summarize/paragraph",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );
      const dataParagraph = await resParagraph.json();
      setParagraphSummary(
        dataParagraph.summary || "No paragraph summary available"
      );

      const resBulletPoints = await fetch(
        "https://summerize-server-1wsj.onrender.com/api/summarize/bulletpoints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );
      const dataBulletPoints = await resBulletPoints.json();
      setBulletPointsSummary(
        dataBulletPoints.summary ||
          "No bullet points summary available, due to SAFETY"
      );

      console.log("Paragraph Summary:", dataParagraph);
      console.log("Bullet Points Summary:", dataBulletPoints);

      const userEmail = session?.user?.email;

      if (!userEmail) {
        return;
      }

      const storePromptResult = await addPromptData({
        userEmail:userEmail,
        prompts: prompt,
        paragraphs: dataParagraph,
        points: dataBulletPoints,
      })
      if (storePromptResult.success) {
        console.log("Prompt saved successfully");
      } else {
        console.error("Failed to save prompt");
        return;
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = () => {
    const textToCopy =
      activeTab === "paragraph" ? paragraphSummary : bulletPointsSummary;
    if (textToCopy && textToCopy !== "Fetching summary...") {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() =>
          toast.success(`Text copied to clipboard of ${activeTab} summary.`)
        )
        .catch((err) => console.error("Could not copy text: ", err));
    } else {
      toast.error("No summary generated to copy.");
    }
  };

  const handleDownloadTextFile = () => {
    const textToDownload =
      activeTab === "paragraph" ? paragraphSummary : bulletPointsSummary;
    if (textToDownload && textToDownload !== "Fetching summary...") {
      const blob = new Blob([textToDownload], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Text Downloaded to summary.${activeTab}`);
    } else {
      toast.error("No summary generated to download.");
    }
  };

  const handleResetSummarySection = () => {
    setParagraphSummary("");
    setBulletPointsSummary("");
  };

  return (
    <div className="w-[425px] md:w-[500px] lg:w-[620px] h-max flex flex-col items-center justify-start pt-6 px-6 gap-x-16 gap-y-6  ">
      <div className="  ">
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter text to analyze and summarize..."
          rows={10}
          cols={65}
          className="border-2 border-black/50 rounded-lg p-3 mb-4 w-full"
        />
        <div className="flex gap-x-4">
          <button
            onClick={fetchResponse}
            className=" w-full text-xl font-semibold p-2 rounded-md bg-black/80 text-neutral-100/85 hover:text-white hover:bg-black transition-all duration-300 ease-out active:scale-95  "
          >
            Summarize
          </button>
        </div>
      </div>
      <div className=" w-full ">
        <div className=" w-full flex items-center justify-between text-xl md:text-2xl font-semibold text-neutral-100 bg-black p-3 rounded-t-xl ">
          <span className="text-2xl md:text-3xl font-bold tracking-tight md:tracking-normal  ">
            Generated Text
          </span>
          <div className="flex gap-x-4">
            <span
              className="text-neutral-100 hover:text-white cursor-pointer active:scale-95 duration-300 ease-out"
              onClick={handleCopyText}
            >
              <FaCopy />
            </span>
            <span
              className="text-neutral-100 hover:text-white cursor-pointer active:scale-95 duration-300 ease-out"
              onClick={handleDownloadTextFile}
            >
              <FaFileDownload />
            </span>
            <span
              className="text-neutral-100 hover:text-white cursor-pointer active:rotate-180 duration-300 ease-out"
              onClick={handleResetSummarySection}
            >
              <GrPowerReset />
            </span>
          </div>
        </div>
        <Tabs
          defaultValue="paragraph"
          className=" border-x-4 border-b-4 border-black rounded-b-xl w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className=" w-full flex items-center justify-center ">
            <TabsTrigger value="paragraph" className=" w-full ">
              Paragraph
            </TabsTrigger>
            <TabsTrigger value="points" className=" w-full ">
              Points
            </TabsTrigger>
          </TabsList>
          <TabsContent value="paragraph" className="">
            <div className="w-full h-80 flex flex-col items-start justify-start gap-y-2 bg-[#2F2F2F] p-3 border-t-4 border-black rounded-b-xl  text-white overflow-y-auto ">
              {loading ? (
                <div className="flex justify-center items-center w-full">
                  <div className="loader"></div>
                </div>
              ) : paragraphSummary ? (
                <ReactMarkdown>{paragraphSummary}</ReactMarkdown>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <h3 className=" text-2xl md:text-3xl font-bold">
                    Enter Text
                  </h3>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="points" className=" ">
            <div className="w-full h-80 flex flex-col items-start justify-start gap-y-2 bg-[#2F2F2F] p-3 border-t-4 border-black rounded-b-xl text-white overflow-y-auto ">
              {loading ? (
                <div className="flex justify-center items-center w-full">
                  <div className="loader"></div>
                </div>
              ) : bulletPointsSummary ? (
                <ReactMarkdown>{bulletPointsSummary}</ReactMarkdown>
              ) : (
                <div className="flex justify-center items-center w-full">
                  <h3 className="text-3xl font-bold">Enter Text</h3>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
