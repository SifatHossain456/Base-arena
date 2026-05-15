import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { FeaturedArenas } from '@/components/home/FeaturedArenas';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TopBanner } from '@/components/home/TopBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <FeaturedArenas />
      <HowItWorks />
      <TopBanner />
    </>
  );
}
