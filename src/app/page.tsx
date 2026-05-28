import { HeroSection } from '@/components/landing/HeroSection'
import { DemoPreview } from '@/components/landing/DemoPreview'
import { FeatureGrid } from '@/components/landing/FeatureGrid'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { UseCases } from '@/components/landing/UseCases'
import { FaqSection } from '@/components/landing/FaqSection'
import { WaitlistCTA } from '@/components/landing/WaitlistCTA'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DemoPreview />
      <FeatureGrid />
      <HowItWorks />
      <UseCases />
      <FaqSection />
      <WaitlistCTA />
    </>
  )
}
