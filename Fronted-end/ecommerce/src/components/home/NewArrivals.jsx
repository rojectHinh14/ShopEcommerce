import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import ProductCard from "../product/ProductCard"

export default function NewArrivals() {
  const newProducts = [
    {
      id: 101,
      name: "Áo thun unisex",
      price: 350000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
      category: "unisex",
      discount: 0,
      rating: 4.5,
      isNew: true,
    },
    {
      id: 102,
      name: "Quần short nữ",
      price: 450000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      category: "women",
      discount: 0,
      rating: 4.3,
      isNew: true,
    },
    {
      id: 103,
      name: "Áo khoác bomber",
      price: 1250000,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop",
      category: "men",
      discount: 0,
      rating: 4.7,
      isNew: true,
    },
    {
      id: 104,
      name: "Váy liền thân",
      price: 750000,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      category: "women",
      discount: 0,
      rating: 4.6,
      isNew: true,
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Hàng mới về</h2>
          <Link to="/new-arrivals" className="flex items-center text-sm font-medium hover:underline">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
