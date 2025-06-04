import { Menu, Star } from "lucide-react"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import { useState } from "react"
import { Link } from "react-router-dom"


export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Tôi rất hài lòng với chất lượng sản phẩm và dịch vụ khách hàng tuyệt vời. Sẽ tiếp tục mua sắm ở đây trong tương lai.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4,
      text: "Sản phẩm đúng như mô tả, giao hàng nhanh chóng. Tôi đặc biệt thích chất liệu vải rất thoải mái.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      text: "Đây là lần thứ ba tôi mua sắm tại đây và chưa bao giờ thất vọng. Giá cả hợp lý và chất lượng tuyệt vời.",
    },
  ]

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.text}</p>
          </div>
        ))}
      </div>

      {/* Nút mở Drawer */}
      <IconButton onClick={() => setDrawerOpen(true)} className="md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="flex flex-col h-full w-64 p-4">
          {/* Nội dung menu như cũ */}
        </div>
      </Drawer>
    </section>
  )
}
