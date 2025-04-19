import ChatBox from "@/components/ChatBox";
import Header from "@/components/landingpage/Header";
import HeroSection from "@/components/landingpage/HeroSection";
import ProjectGrid from "@/components/landingpage/ProjectGrid";
import PromptInput from "@/components/landingpage/PromptInput";
import SamplePrompts from "@/components/landingpage/SamplePrompts";


export default function Home() {
  return (

    // <div className="flex justify-center">
    //   <ChatBox></ChatBox>
    // </div>
    <main className="min-h-screen bg-[#141414]">
    <Header />
    <HeroSection />
    <PromptInput />
    <SamplePrompts />
    <ProjectGrid />
  </main>
  );
}
