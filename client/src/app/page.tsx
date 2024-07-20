import History from "@/components/History";
import Navbar from "../components/navbar";
import { Summarizer } from "../components/Summarizer";

const Home = () => {
  return (
    <div className=" flex bg-[#212121] overflow-auto ">
      <div className="hidden sm:block w-56 md:w-64 lg:w-72 min-h-screen h-full max-h-max">
        <History />
      </div>
      <div className=" w-full flex flex-col items-center justify-start relative h-screen  bg-[#212121] ">
        <Navbar />
        <Summarizer />
      </div>
    </div>
  );
};

export default Home;
