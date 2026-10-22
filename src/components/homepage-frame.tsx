import { AboutContent } from "@/components/about-page";
import { HeroSection } from "@/components/hero-section";
import { NewsContent } from "@/components/news-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function HomepageFrame() {
  return (
    <>
    <div className="homepage-viewport">
      <div className="homepage-canvas">
        <SiteHeader cart />
        <main>
          <HeroSection />
        </main>
      </div>
    </div>
    <AboutContent />
    <NewsContent />
    <SiteFooter />
    </>
  );
}
