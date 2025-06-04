import { Link } from "react-router-dom"

export default function CategoriesSection() {
  const categories = [
    {
      id: 1,
      name: "Thời trang nam",
      image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=400&fit=crop",
      link: "/men",
    },
    {
      id: 2,
      name: "Thời trang nữ",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=400&fit=crop",
      link: "/women",
    },
    {
      id: 3,
      name: "Phụ kiện",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
      link: "/accessories",
    },
    {
      id: 4,
      name: "Giày dép",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
      link: "/shoes",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {categories.map((category) => (
          <Link key={category.id} to={category.link} className="group relative overflow-hidden rounded-lg">
            <div className="aspect-[3/4] relative">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
