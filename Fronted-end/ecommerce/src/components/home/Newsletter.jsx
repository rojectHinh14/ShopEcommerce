"use client"

import { useState } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { toast } from "react-toastify"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email")
      return
    }

    setIsLoading(true)

    // Giả lập API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Đăng ký nhận bản tin thành công!")
      setEmail("")
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-[#3c2a21] text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Đăng ký nhận bản tin</h2>
        <p className="mb-8 text-gray-300">
          Đăng ký để nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và các sự kiện độc quyền.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <TextField
            type="email"
            placeholder="Nhập địa chỉ email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-black"
            size="small"
            fullWidth
          />
          <Button type="submit" disabled={isLoading} variant="contained" color="primary">
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>
      </div>
    </section>
  )
}
