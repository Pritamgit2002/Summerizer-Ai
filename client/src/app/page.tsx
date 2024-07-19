import History from "@/components/History";
import Navbar from "../components/navbar";
import { Summarizer } from "../components/Summarizer";

const Home = () => {
  return (
    <div className=" w-full min-h-screen h-full flex is  bg-[#212121]">
      <div className="   ">
        <History />
      </div>
      <div className=" w-full flex flex-col items-center justify-start relative min-h-screen ">
        <Navbar />
        <Summarizer />
      </div>
    </div>
  );
};

export default Home;
