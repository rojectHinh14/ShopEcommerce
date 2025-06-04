"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@mui/material"
import { Input } from "@mui/material"
import { Card } from "@mui/material"
import { CardContent } from "@mui/material"
import { CardHeader } from "@mui/material"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuth } from "../hooks/useAuth"
import { toast } from "react-toastify"
import { Tabs, Tab } from "@mui/material"

const registerSchema = Yup.object({
  firstName: Yup.string().required("Họ là bắt buộc"),
  lastName: Yup.string().required("Tên là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  agreeTerms: Yup.boolean().oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { register, auth } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)


  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
      newsletter: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const fullName = `${values.firstName} ${values.lastName}`;
        const result = await register(fullName, values.email, values.password, values.phone);
        if (result.success) {
          toast.success("Đăng ký thành công!")
          navigate("/")
        } else {
          toast.error(result.error)
        }
      } catch(error) {
        console.error("Registration error:", error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
      } finally {
        setIsSubmitting(false);
      }
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to home */}
        <div>
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold">Đăng ký tài khoản</h2>
            <p className="text-gray-600">Tạo tài khoản để bắt đầu mua sắm</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Họ
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Họ"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.firstName && formik.errors.firstName ? "border-red-500" : ""}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Tên"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.lastName && formik.errors.lastName ? "border-red-500" : ""}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? "border-red-500" : ""}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.phone && formik.errors.phone ? "border-red-500" : ""}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.password && formik.errors.password ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formik.values.agreeTerms}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                    Tôi đồng ý với{" "}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      điều khoản sử dụng
                    </Link>{" "}
                    và{" "}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      chính sách bảo mật
                    </Link>
                  </label>
                </div>
                {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                  <p className="text-sm text-red-600">{formik.errors.agreeTerms}</p>
                )}

                <div className="flex items-center">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formik.values.newsletter}
                    onChange={formik.handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">
                    Đăng ký nhận bản tin và ưu đãi đặc biệt
                  </label>
                </div>
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full" size="lg" disabled={auth.loading}>
              {isSubmitting || auth.loading ? "Đang xử lý..." : "Đăng nhập/Đăng ký"}
              </Button>

              {/* Error message */}
              {auth.error && <p className="text-sm text-red-600 text-center">{auth.error}</p>}
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>
            </div>

            {/* Social register */}
            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Đăng ký với Google
              </Button>

              <Button variant="outline" className="w-full" size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Đăng ký với Facebook
              </Button>
            </div>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}
