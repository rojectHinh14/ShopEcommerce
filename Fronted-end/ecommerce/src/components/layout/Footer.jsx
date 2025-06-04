import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#3c2a21] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Fashion Store</h3>
            <p className="text-gray-400 mb-4">
              Chúng tôi cung cấp các sản phẩm thời trang cao cấp với chất lượng tốt nhất, mang đến cho khách hàng trải
              nghiệm mua sắm tuyệt vời.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">Youtube</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/men" className="text-gray-400 hover:text-white">
                  Thời trang nam
                </Link>
              </li>
              <li>
                <Link to="/women" className="text-gray-400 hover:text-white">
                  Thời trang nữ
                </Link>
              </li>
              <li>
                <Link to="/accessories" className="text-gray-400 hover:text-white">
                  Phụ kiện
                </Link>
              </li>
              <li>
                <Link to="/shoes" className="text-gray-400 hover:text-white">
                  Giày dép
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-gray-400 hover:text-white">
                  Khuyến mãi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                <a href="tel:+84123456789" className="text-gray-400 hover:text-white">
                  +84 123 456 789
                </a>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                <a href="mailto:info@fashionstore.com" className="text-gray-400 hover:text-white">
                  info@fashionstore.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Fashion Store. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
