import { useState, useEffect } from 'react';

const images = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/5.jpg',
  // '/6.jpg',
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const next = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full overflow-hidden rounded-md md:rounded-xl group aspect-[293/120] md:aspect-[4/1] lg:aspect-[21/5]">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        aria-label="Previous banner"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        aria-label="Next banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-white w-4' : 'bg-white/40 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
