'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { HeroBanner as HeroBannerType } from '@/types';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface HeroBannerSwiperProps {
  banners: HeroBannerType[];
}

export function HeroBannerSwiper({ banners }: HeroBannerSwiperProps) {
  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
        bulletClass: 'swiper-pagination-bullet !bg-white/50 !w-1.5 !h-1.5 sm:!w-2 sm:!h-2 md:!w-3 md:!h-3',
        bulletActiveClass: '!bg-white !opacity-100',
      }}
      loop={banners.length > 1}
      className="h-full w-full rounded-2xl"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div className="relative h-full w-full">
            <Image
              src={banner.imageLink}
              alt={banner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 flex items-end sm:items-center pb-8 sm:pb-0">
              <div className="max-w-7xl px-3 sm:px-4 md:px-20 z-10">
                <div className="max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl">
                  {banner.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-3 md:mb-6">
                      {banner.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-1.5 py-0.5 sm:px-2 sm:py-0.5 md:px-4 md:py-1.5 bg-[#0052cc] text-white text-[10px] sm:text-xs md:text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h1 className="text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-white leading-tight">
                    {banner.title}
                  </h1>
                  {banner.subtitle && (
                    <p className="text-[10px] sm:text-xs md:text-base lg:text-lg text-gray-200 mb-2 sm:mb-4 md:mb-8 mt-0.5 sm:mt-1 md:mt-2 line-clamp-2">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      <Link
                        href={banner.link}
                        className="inline-flex items-center px-2.5 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-4 bg-black text-white text-[10px] sm:text-xs md:text-base font-semibold rounded-lg md:rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        구매하러 가기
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 ml-1 md:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
