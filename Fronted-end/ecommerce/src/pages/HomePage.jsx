import HeroSection from "../components/home/HeroSection"
import CategoriesSection from "../components/home/CategoriesSection"
import FeaturedProducts from "../components/home/FeaturedProducts"
import NewArrivals from "../components/home/NewArrivals"
import Testimonials from "../components/home/Testimonials"
import Newsletter from "../components/home/Newsletter"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <NewArrivals />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
