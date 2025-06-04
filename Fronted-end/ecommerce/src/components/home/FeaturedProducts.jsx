"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../product/ProductCard"
import Button from "@mui/material/Button"
import { productService } from "../../services/productService"
import { toast } from "react-toastify"

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState("all")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [activeTab])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let response
      
      switch (activeTab) {
        case "best-selling":
          response = await productService.getBestSellingProducts(8)
          setProducts(response.data)
          break
        case "most-viewed":
          response = await productService.getMostViewedProducts(8)
          setProducts(response.data)
          break
        case "top-rated":
          response = await productService.getTopRatedProducts(8)
          setProducts(response.data)
          break
        default:
          response = await productService.getAllProducts(0, 8)
          setProducts(response.data.content)
      }
    } catch (err) {
      setError("Không thể tải danh sách sản phẩm")
      toast.error("Có lỗi xảy ra khi tải sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>
        <div className="text-center text-red-500">{error}</div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Sản phẩm nổi bật</h2>

      <div className="flex justify-center mb-8 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "all" ? "contained" : "outlined"}
            onClick={() => setActiveTab("all")}
            sx={{ minWidth: 80 }}
          >
            Tất cả
          </Button>
          <Button
            variant={activeTab === "best-selling" ? "contained" : "outlined"}
            onClick={() => setActiveTab("best-selling")}
            sx={{ minWidth: 80 }}
          >
            Bán chạy
          </Button>
          <Button
            variant={activeTab === "most-viewed" ? "contained" : "outlined"}
            onClick={() => setActiveTab("most-viewed")}
            sx={{ minWidth: 80 }}
          >
            Xem nhiều
          </Button>
          <Button
            variant={activeTab === "top-rated" ? "contained" : "outlined"}
            onClick={() => setActiveTab("top-rated")}
            sx={{ minWidth: 80 }}
          >
            Đánh giá cao
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button component={Link} to="/products" size="large" variant="contained" sx={{ backgroundColor: 'var(--primary)', '&:hover': { backgroundColor: 'var(--primary)' } }}>
          Xem tất cả sản phẩm
        </Button>
      </div>
    </section>
  )
}
