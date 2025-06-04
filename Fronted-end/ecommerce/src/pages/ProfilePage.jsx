"use client"

import { useState, useEffect } from 'react';
import {  ShoppingBag, LocationOn, Edit, Save, Cancel, CloudUpload } from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Avatar,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { orderService } from '../services/orderService';

// Thêm base URL cho API
const API_BASE_URL = 'http://localhost:8080'; // TODO: Cấu hình trong file .env.local
const FILE_SERVER_BASE_URL = 'http://localhost:8080'; // Base URL cho server phục vụ file (thường cùng cổng với API)

// Validation schemas
const profileSchema = Yup.object({
  firstName: Yup.string().required('Họ là bắt buộc'),
  lastName: Yup.string().required('Tên là bắt buộc'),
  dateOfBirth: Yup.date().nullable(),
  gender: Yup.string().oneOf(['MALE', 'FEMALE', 'OTHER'], 'Giới tính không hợp lệ'),
  avatarUrl: Yup.string().url('URL không hợp lệ').nullable(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Mật khẩu hiện tại là bắt buộc'),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu mới là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { auth, updateUserInfo } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderPage, setOrderPage] = useState(0);
  const [orderTotalPages, setOrderTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    isDefault: false,
  });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Formik for profile update
  const profileFormik = useFormik({
    initialValues: {
      firstName: auth.user?.firstName || '',
      lastName: auth.user?.lastName || '',
      dateOfBirth: auth.user?.dob || '',
      gender: auth.user?.gender || '',
      avatarUrl: auth.user?.avatarUrl || '',
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      try {
        let avatarBase64 = null;
        if (selectedFile) {
          // Chuyển file thành base64
          const reader = new FileReader();
          avatarBase64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(selectedFile);
          });
        }

        const result = await updateUserInfo({
          ...values,
          avatarBase64: avatarBase64
        });
        
        if (result.success) {
          toast.success('Cập nhật thông tin thành công!');
          setEditMode(false);
          setSelectedFile(null);
          setPreviewUrl(null);
        } else {
          toast.error(result.error || 'Cập nhật thất bại');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật thông tin');
      }
    },
  });

  // Formik for password change
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      try {
        const result = await userService.updatePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        if (result.success) {
          toast.success('Đổi mật khẩu thành công!');
          passwordFormik.resetForm();
        } else {
          toast.error(result.message || 'Đổi mật khẩu thất bại');
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi đổi mật khẩu');
      }
    },
  });

  useEffect(() => {
    if (!auth.user) return;
    console.log('Current user data:', auth.user);
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setLoadingOrders(true);
        const [addressesData, ordersResponse] = await Promise.all([
          userService.getAddresses(),
          orderService.getMyOrders(orderPage, 10)
        ]);
        console.log("📦 Mapped addresses", addressesData);
        setAddresses(addressesData);
        
        // Handle orders data
        if (ordersResponse?.data?.data) {
          setOrders(ordersResponse.data.data.content || []);
          setOrderTotalPages(ordersResponse.data.data.totalPages || 0);
        }
      } catch (error) {
        toast.error('Không thể tải dữ liệu người dùng');
      } finally {
        setLoading(false);
        setLoadingOrders(false);
      }
    };
  
    fetchUserData();
  }, [auth.user, orderPage]);

  const handleAddAddress = async () => {
    try {
      await userService.addAddress(newAddress);
      const updatedAddresses = await userService.getAddresses();
      setAddresses(updatedAddresses);
      setAddressDialog(false);
      setNewAddress({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        isDefault: false,
      });
      toast.success('Thêm địa chỉ thành công');
    } catch (error) {
      toast.error('Không thể thêm địa chỉ');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await userService.deleteAddress(addressId);
      const updatedAddresses = await userService.getAddresses();
      setAddresses(updatedAddresses);
      toast.success('Xóa địa chỉ thành công');
    } catch (error) {
      toast.error('Không thể xóa địa chỉ');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleOrderPageChange = (event, newPage) => {
    setOrderPage(newPage - 1);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      // Refresh orders after cancellation
      const ordersResponse = await orderService.getMyOrders(orderPage, 10);
      if (ordersResponse?.data?.data) {
        setOrders(ordersResponse.data.data.content || []);
      }
      toast.success('Hủy đơn hàng thành công');
    } catch (error) {
      toast.error('Không thể hủy đơn hàng');
    }
  };

  // Hàm xử lý khi chọn file
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm helper để tạo URL đầy đủ cho avatar
  const getAvatarUrl = (path) => {
    console.log('Avatar path from backend:', path);
    if (!path) {
      console.log('No avatar path provided');
      return null;
    }
    
    // Nếu đường dẫn từ backend bắt đầu bằng tiền tố cổng 8082, thay thế bằng cổng 8080
    if (path.startsWith('http://localhost:8082/file/avatar/')) {
      const correctedPath = path.replace('http://localhost:8082', 'http://localhost:8080');
      console.log('Corrected avatar URL (changed port 8082 to 8080):', correctedPath);
      return correctedPath;
    }

    // Nếu đường dẫn từ backend đã là URL đầy đủ (bắt đầu bằng http) nhưng không phải cổng 8082, sử dụng nó trực tiếp.
    if (path.startsWith('http')) {
      console.log('Using full URL from backend (not port 8082):', path);
      return path;
    }

    // Nếu không phải là URL đầy đủ, ghép với FILE_SERVER_BASE_URL (cổng 8080) và /file/avatar/
    const fullUrl = `${FILE_SERVER_BASE_URL}/file/avatar/${path.split('/').pop()}`;
    console.log('Generated avatar URL (relative path assumed, using port 8080):', fullUrl);
    return fullUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="md:col-span-2">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Typography variant="h4" className="mb-8">
          Tài khoản của tôi
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Typography variant="h6">
                    Thông tin cá nhân
                  </Typography>
                  {!editMode ? (
                    <IconButton onClick={() => setEditMode(true)}>
                      <Edit />
                    </IconButton>
                  ) : (
                    <div className="space-x-2">
                      <IconButton onClick={() => profileFormik.handleSubmit()}>
                        <Save />
                      </IconButton>
                      <IconButton onClick={() => setEditMode(false)}>
                        <Cancel />
                      </IconButton>
                    </div>
                  )}
                </div>

                {!editMode ? (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <Avatar
                        src={getAvatarUrl(auth.user?.pathAvatar)}
                        alt={`${auth.user?.firstName} ${auth.user?.lastName}`}
                        sx={{ width: 100, height: 100 }}
                      />
                    </div>
                    <Typography variant="body1">
                      <strong>Họ tên:</strong> {`${auth.user?.firstName} ${auth.user?.lastName}`}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {auth.user?.email}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Số điện thoại:</strong> {auth.user?.phoneNumber}
                    </Typography>
                    {auth.user?.dob && (
                      <Typography variant="body1">
                        <strong>Ngày sinh:</strong> {new Date(auth.user.dob).toLocaleDateString()}
                      </Typography>
                    )}
                    {auth.user?.gender && (
                      <Typography variant="body1">
                        <strong>Giới tính:</strong> {auth.user.gender}
                      </Typography>
                    )}
                  </div>
                ) : (
                  <form onSubmit={profileFormik.handleSubmit} className="space-y-4">
                    <div className="flex flex-col items-center mb-4">
                      <Avatar
                        src={previewUrl || getAvatarUrl(auth.user?.pathAvatar)}
                        alt={`${auth.user?.firstName} ${auth.user?.lastName}`}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      />
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="avatar-upload">
                        <Button
                          variant="contained"
                          component="span"
                          startIcon={<CloudUpload />}
                        >
                          Chọn ảnh đại diện
                        </Button>
                      </label>
                    </div>
                    <TextField
                      fullWidth
                      label="Họ"
                      name="firstName"
                      value={profileFormik.values.firstName}
                      onChange={profileFormik.handleChange}
                      error={profileFormik.touched.firstName && Boolean(profileFormik.errors.firstName)}
                      helperText={profileFormik.touched.firstName && profileFormik.errors.firstName}
                    />
                    <TextField
                      fullWidth
                      label="Tên"
                      name="lastName"
                      value={profileFormik.values.lastName}
                      onChange={profileFormik.handleChange}
                      error={profileFormik.touched.lastName && Boolean(profileFormik.errors.lastName)}
                      helperText={profileFormik.touched.lastName && profileFormik.errors.lastName}
                    />
                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      name="dateOfBirth"
                      type="date"
                      value={profileFormik.values.dateOfBirth}
                      onChange={profileFormik.handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      select
                      label="Giới tính"
                      name="gender"
                      value={profileFormik.values.gender}
                      onChange={profileFormik.handleChange}
                    >
                      <MenuItem value="MALE">Nam</MenuItem>
                      <MenuItem value="FEMALE">Nữ</MenuItem>
                      <MenuItem value="OTHER">Khác</MenuItem>
                    </TextField>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card className="mt-4">
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Đổi mật khẩu
                </Typography>
                <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                    helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu mới"
                    name="newPassword"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                    helperText={passwordFormik.touched.newPassword && passwordFormik.errors.newPassword}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                    helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={passwordFormik.isSubmitting}
                  >
                    {passwordFormik.isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabs Content */}
          <Grid item xs={12} md={8}>
            <Card>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
              >
                <Tab icon={<LocationOn />} label="Địa chỉ" />
                <Tab icon={<ShoppingBag />} label="Đơn hàng" />
              </Tabs>

              {/* Addresses Tab */}
              <TabPanel value={activeTab} index={0}>
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h6">Địa chỉ của tôi</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAddressDialog(true)}
                  >
                    Thêm địa chỉ
                  </Button>
                </div>
                <List>
                  {console.log("address" , addresses)}
                  {/* Original ListItem code */}
                  {addresses.map((address) => (
                    <ListItem
                      key={address.id}
                      className="border rounded-lg mb-2"
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <div className="flex items-center">
                            <Typography variant="subtitle1">
                              {address.fullName}
                            </Typography>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded">
                                Mặc định
                              </span>
                            )}
                          </div>
                        }
                        secondary={
                          <>
                            <Typography variant="body2">
                              {address.phone}
                            </Typography>
                            <Typography variant="body2">
                              {`${address.address}, ${address.ward}, ${address.district}, ${address.city}`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>

              {/* Orders Tab */}
              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" className="mb-4">
                  Lịch sử đơn hàng
                </Typography>
                {loadingOrders ? (
                  <div className="flex justify-center py-4">
                    <CircularProgress />
                  </div>
                ) : orders.length > 0 ? (
                  <>
                    {orders.map((order) => (
                      <Card key={order.id} className="mb-4">
                        <CardContent>
                          <div className="flex justify-between items-start">
                            <div>
                              <Typography variant="subtitle1">
                                Đơn hàng #{order.orderNumber}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                              <Typography
                                variant="subtitle1"
                                color={
                                  order.status === 'COMPLETED'
                                    ? 'success'
                                    : order.status === 'CANCELLED'
                                    ? 'error'
                                    : order.status === 'PENDING'
                                    ? 'warning'
                                    : 'primary'
                                }
                              >
                                {order.status === 'COMPLETED' ? 'Hoàn thành' :
                                 order.status === 'CANCELLED' ? 'Đã hủy' :
                                 order.status === 'PENDING' ? 'Đang xử lý' :
                                 order.status === 'SHIPPING' ? 'Đang giao hàng' :
                                 order.status}
                              </Typography>
                              {order.status === 'PENDING' && (
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Hủy đơn
                                </Button>
                              )}
                            </div>
                          </div>
                          <Divider className="my-2" />
                          <div className="space-y-2">
                            <Typography variant="body2">
                              Tổng tiền: {formatCurrency(order.totalAmount)}
                            </Typography>
                            <Typography variant="body2">
                              Phương thức thanh toán: {order.paymentMethod || 'Chưa xác định'}
                            </Typography>
                            {order.shippingAddress && (
                              <Typography variant="body2">
                                Địa chỉ giao hàng: {order.shippingAddress}
                              </Typography>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="flex justify-center mt-4">
                      <Pagination
                        count={orderTotalPages}
                        page={orderPage + 1}
                        onChange={handleOrderPageChange}
                        color="primary"
                      />
                    </div>
                  </>
                ) : (
                  <Typography variant="body1" className="text-center py-4">
                    Chưa có đơn hàng nào
                  </Typography>
                )}
              </TabPanel>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* Add Address Dialog */}
      <Dialog open={addressDialog} onClose={() => setAddressDialog(false)}>
        <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Họ tên"
            value={newAddress.fullName}
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullName: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Số điện thoại"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            value={newAddress.address}
            onChange={(e) =>
              setNewAddress({ ...newAddress, address: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Tỉnh/Thành phố"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Quận/Huyện"
            value={newAddress.district}
            onChange={(e) =>
              setNewAddress({ ...newAddress, district: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phường/Xã"
            value={newAddress.ward}
            onChange={(e) =>
              setNewAddress({ ...newAddress, ward: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddressDialog(false)}>Hủy</Button>
          <Button onClick={handleAddAddress} variant="contained">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
