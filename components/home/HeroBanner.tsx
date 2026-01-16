import Link from 'next/link';
import Image from 'next/image';
import { HeroBanner as HeroBannerType } from '@/types';
import { getFirstHeroBanner } from '@/data/hero-banners';

export async function HeroBanner() {
  const banner = await getFirstHeroBanner();

  if (!banner) {
    return null;
  }

  return (
    <section className="relative aspect-21/9 flex items-center overflow-hidden rounded-2xl md:mt-10 mx-2">
      <div className="absolute inset-0">
        <Image
          src={banner.imageLink}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
      </div>
      <div className="relative max-w-7xl px-6 z-10">
        <div className="max-w-xl">
          {banner.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {banner.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-[#0052cc] text-white text-xs md:text-sm font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle && (
            <p className="text-sm md:text-lg text-gray-200 mb-4 md:mb-8 mt-2">
              {banner.subtitle}
            </p>
          )}
          {banner.link && (
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link
                href={banner.link}
                className="inline-flex items-center px-5 py-2.5 md:px-8 md:py-4 bg-[#0052cc] text-white text-sm md:text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                구매하러 가기
                <svg className="w-4 h-4 md:w-5 md:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
