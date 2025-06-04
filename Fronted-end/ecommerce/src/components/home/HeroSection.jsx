import { useState } from "react"
import Button from "@mui/material/Button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Bộ sưu tập mùa hè 2025",
      description: "Khám phá các xu hướng thời trang mới nhất với bộ sưu tập mùa hè độc quyền của chúng tôi.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      cta: "Mua ngay",
      link: "/collections/summer-2025",
    },
    {
      id: 2,
      title: "Thời trang nam cao cấp",
      description: "Nâng tầm phong cách của bạn với bộ sưu tập thời trang nam cao cấp mới nhất.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      cta: "Khám phá",
      link: "/men",
    },
    {
      id: 3,
      title: "Thời trang nữ sang trọng",
      description: "Tỏa sáng với bộ sưu tập thời trang nữ sang trọng và đẳng cấp.",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=600&fit=crop",
      cta: "Xem ngay",
      link: "/women",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 lg:p-24 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8 max-w-xl">{slide.description}</p>
              <Button component={Link} to={slide.link} size="large" variant="contained" sx={{ backgroundColor: 'var(--primary)', color: '#fff', '&:hover': { backgroundColor: 'var(--primary)' } }}>
                {slide.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </section>
  )
}
