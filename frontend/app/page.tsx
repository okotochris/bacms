// app/page.tsx
import Link from "next/link";
import Header from "./component/header";
import Footer from "./component/footer";
import Hero from "./component/hero";
import OurClasses from "./component/section";


export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      
      <Header />
      <Hero />
      <OurClasses />
      <Footer />
    </div>
  );
}