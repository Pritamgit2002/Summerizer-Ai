"use client";
import { useState, ChangeEvent } from "react";
import { FaCopy, FaFileDownload } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export const Summarizer = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("Fetching summary...");

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const fetchResponse = async (url: string) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(
        data.summary || data.sentiment || data.topics || data.keywords
      );
      console.log("Response:", data);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };
  const handleCopyText = () => {
    if (response && response !== "Fetching summary...") {
      navigator.clipboard
        .writeText(response)
        .then(() => alert("Text copied to clipboard"))
        .catch((err) => console.error("Could not copy text: ", err));
    } else {
      alert("No text to copy.");
    }
  };

  const handleDownloadTextFile = () => {
    if (response && response !== "Fetching summary...") {
      const blob = new Blob([response], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "response.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert("No text to download.");
    }
  };
  return (
    <div className="w-full min-h-screen flex items-start justify-center pt-12 px-16 gap-x-16 bg-neutral-50">
      <div className=" min-w-[510px] max-w-max ">
        <h3 className="text-3xl font-bold mb-4">Summarize Text</h3>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter text to analyze and summarize..."
          rows={12}
          cols={52}
          className="border-2 border-black/50 rounded-lg p-3 mb-4"
        />
        <div className="flex gap-x-4">
          <button
            onClick={() =>
              fetchResponse(
                "https://summerize-server-1wsj.onrender.com/api/summarize/paragraph"
              )
            }
            className="tracking-tighter text-xl font-semibold p-2 rounded-md bg-neutral-900 text-neutral-200 hover:text-white hover:bg-black transition-all duration-300 ease-out"
          >
            Summarize as Paragraph
          </button>
          <button
            onClick={() =>
              fetchResponse(
                "https://summerize-server-1wsj.onrender.com/api/summarize/bulletpoints"
              )
            }
            className="tracking-tighter text-xl font-semibold p-2 rounded-md bg-neutral-900 text-neutral-200 hover:text-white hover:bg-black transition-all duration-300 ease-out"
          >
            Summarize as Bullet Points
          </button>
          {/* <button
          onClick={() => fetchResponse("http://localhost:8080/api/sentiment")}
          className="tracking-tighter text-xl font-semibold p-2 rounded-md bg-neutral-900 text-neutral-200 hover:text-white hover:bg-black transition-all duration-300 ease-out"
        >
          Sentiment Analysis
        </button>
        <button
          onClick={() => fetchResponse("http://localhost:8080/api/topics")}
          className="tracking-tighter text-xl font-semibold p-2 rounded-md bg-neutral-900 text-neutral-200 hover:text-white hover:bg-black transition-all duration-300 ease-out"
        >
          Topic Identification
        </button>
        <button
          onClick={() => fetchResponse("http://localhost:8080/api/keywords")}
          className="tracking-tighter text-xl font-semibold p-2 rounded-md bg-neutral-900 text-neutral-200 hover:text-white hover:bg-black transition-all duration-300 ease-out"
        >
          Keyword Extraction
        </button> */}
        </div>
      </div>
      <div>
        <div className="w-[615px] flex items-center justify-between text-2xl font-semibold text-neutral-100 bg-black p-3 rounded-t-xl ">
          <span>Generated Text</span>
          <div className="flex gap-x-4">
            <span
              className="text-neutral-100 hover:text-white cursor-pointer active:scale-95 "
              onClick={handleCopyText}
            >
              <FaCopy />
            </span>
            <span
              className="text-neutral-100 hover:text-white cursor-pointer active:scale-95 "
              onClick={handleDownloadTextFile}
            >
              <FaFileDownload />
            </span>
          </div>
        </div>
        <div className=" w-[615px] min-h-96 max-h-max flex flex-col items-start justify-start gap-y-2 bg-neutral-200/40 p-2 border-4 border-black rounded-b-xl ">
          {prompt ? (
            response ? (
              <ReactMarkdown>{response}</ReactMarkdown>
            ) : (
              <div className="flex justify-center items-center w-full">
                <h3 className="text-3xl font-bold">No Response</h3>
              </div>
            )
          ) : (
            <div className="flex justify-center items-center w-full">
              <h3 className="text-3xl font-bold">Enter Text</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
