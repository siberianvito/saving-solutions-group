import Preloader from "@/components/Preloader";
import Hero from "@/components/sections/Hero";
import Protect from "@/components/sections/Protect";
import Engine from "@/components/sections/Engine";
import Manifesto from "@/components/sections/Manifesto";
import SmartApp from "@/components/sections/SmartApp";
import Platform from "@/components/sections/Platform";
import Water from "@/components/sections/Water";
import Founder from "@/components/sections/Founder";
import { ServiceTeaser, FinalCTA } from "@/components/sections/Closing";
import { availableMedia } from "@/lib/media";
import { PROTECT } from "@/lib/data";

export default function Home() {
  const media = availableMedia(PROTECT.map((p) => p.image));
  return (
    <main>
      <Preloader />
      <Hero />
      <Protect media={media} />
      <Engine />
      <Manifesto />
      <SmartApp />
      <Platform />
      <Water />
      <Founder />
      <ServiceTeaser />
      <FinalCTA />
    </main>
  );
}
