"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Search, Eye, RotateCcw, Star, ArrowLeft } from "lucide-react"
import {Button, Input} from "@mui/material"
import { Card, CardContent , CardHeader  } from "@mui/material"
import { Badge } from "@mui/material"
import { useAuth } from "../hooks/useAuth"

export default function OrdersPage() {
  const { auth } = useAuth()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock orders data
  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1250000,
      itemCount: 2,
      items: [
        {
          id: 1,
          name: "Áo sơ mi nam trắng",
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=100&h=100&fit=crop",
          price: 450000,
          quantity: 1,
          size: "L",
        },
        {
          id: 2,
          name: "Quần jean nam",
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop",
          price: 550000,
          quantity: 1,
          size: "32",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: "shipping",
      total: 850000,
      itemCount: 1,
      items: [
        {
          id: 3,
          name: "Áo khoác nữ",
          image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop",
          price: 850000,
          quantity: 1,
          size: "M",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-25",
      status: "processing",
      total: 750000,
      itemCount: 1,
      items: [
        {
          id: 4,
          name: "Giày thể thao",
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop",
          price: 750000,
          quantity: 1,
          size: "42",
        },
      ],
    },
    {
      id: "ORD-004",
      date: "2024-01-28",
      status: "pending",
      total: 1450000,
      itemCount: 3,
      items: [
        {
          id: 5,
          name: "Áo vest nam",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop",
          price: 1200000,
          quantity: 1,
          size: "L",
        },
        {
          id: 6,
          name: "Cà vạt",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
          price: 250000,
          quantity: 1,
          size: "One Size",
        },
      ],
    },
    {
      id: "ORD-005",
      date: "2024-02-01",
      status: "cancelled",
      total: 650000,
      itemCount: 1,
      items: [
        {
          id: 7,
          name: "Túi xách nữ",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
          price: 650000,
          quantity: 1,
          size: "One Size",
        },
      ],
    },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setLoading(false)
    }

    if (auth.isAuthenticated) {
      fetchOrders()
    }
  }, [auth.isAuthenticated])

  useEffect(() => {
    let filtered = orders

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: "Chờ xử lý", className: "bg-yellow-500 text-white" },
      processing: { label: "Đang xử lý", className: "bg-blue-500 text-white" },
      shipping: { label: "Đang giao", className: "bg-purple-500 text-white" },
      delivered: { label: "Đã giao", className: "bg-green-500 text-white" },
      cancelled: { label: "Đã hủy", className: "bg-red-500 text-white" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusActions = (order) => {
    switch (order.status) {
      case "pending":
      case "processing":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Xem
              </Link>
            </Button>
            <Button variant="destructive" size="sm">
              Hủy đơn
            </Button>
          </div>
        )
      case "shipping":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Theo dõi
              </Link>
            </Button>
          </div>
        )
      case "delivered":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Xem
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-1" />
              Đánh giá
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Mua lại
            </Button>
          </div>
        )
      case "cancelled":
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/orders/${order.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Xem
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-1" />
              Mua lại
            </Button>
          </div>
        )
      default:
        return (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/orders/${order.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Xem
            </Link>
          </Button>
        )
    }
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Bạn chưa đăng nhập</h2>
            <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem đơn hàng của bạn</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">Đăng ký</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang cá nhân
            </Link>
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
              <p className="text-sm text-gray-600">Tổng đơn hàng</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== "all" ? "Không tìm thấy đơn hàng" : "Chưa có đơn hàng nào"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Bắt đầu mua sắm để tạo đơn hàng đầu tiên"}
              </p>
              <Button asChild>
                <Link to="/">Khám phá sản phẩm</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Đơn hàng #{order.id}</h3>
                      <p className="text-gray-600 text-sm">
                        Ngày đặt: {formatDate(order.date)} • {order.itemCount} sản phẩm
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="font-semibold text-lg mt-1 text-primary">{formatCurrency(order.total)}</p>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-3 mb-4">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-gray-600 text-xs">
                            Size: {item.size} • Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600 text-center py-2">
                        và {order.items.length - 2} sản phẩm khác...
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Link to={`/orders/${order.id}`} className="text-primary hover:underline text-sm font-medium">
                      Xem chi tiết đơn hàng →
                    </Link>
                    <div className="flex flex-wrap gap-2">{getStatusActions(order)}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && filteredOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <h2>Thống kê đơn hàng</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Tổng đơn", value: orders.length, color: "text-blue-600" },
                  {
                    label: "Chờ xử lý",
                    value: orders.filter((o) => o.status === "pending").length,
                    color: "text-yellow-600",
                  },
                  {
                    label: "Đang giao",
                    value: orders.filter((o) => o.status === "shipping").length,
                    color: "text-purple-600",
                  },
                  {
                    label: "Đã giao",
                    value: orders.filter((o) => o.status === "delivered").length,
                    color: "text-green-600",
                  },
                  {
                    label: "Đã hủy",
                    value: orders.filter((o) => o.status === "cancelled").length,
                    color: "text-red-600",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
