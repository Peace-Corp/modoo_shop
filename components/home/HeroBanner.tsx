import { getHeroBanners } from '@/data/hero-banners';
import { HeroBannerSwiper } from './HeroBannerSwiper';

export async function HeroBanner() {
  const banners = await getHeroBanners();

  if (!banners.length) {
    return null;
  }

  return (
    <section className="relative aspect-21/9 overflow-hidden rounded-2xl md:mt-10 mx-2">
      <HeroBannerSwiper banners={banners} />
    </section>
  );
}
