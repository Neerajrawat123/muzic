import { GradientBackground } from "@/components/gradiant-background";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/heroSection";
import Features from "@/components/features";
import Cta from "@/components/Cta";
import Footer from "@/components/footer";
export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);


 


  return (
    <div className="flex min-h-screen flex-col">
      <GradientBackground />

      <Navigation />

      {/* Hero Section */}
      <HeroSection />


      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <Cta />

      {/* Footer */}
      <Footer />
    </div>
  );
}
