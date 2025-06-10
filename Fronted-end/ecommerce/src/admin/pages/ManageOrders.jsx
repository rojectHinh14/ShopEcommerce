import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import { format } from 'date-fns';
import orderService from '../../services/orderService';

const ManageOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try{
      setLoading(true);
      const response = await orderService.getAllOrders(page, rowsPerPage);
      console.log('Orders API response:', response);

      if(response){
        setOrders(response.content || []);
        setTotalOrders(response.totalElements || 0);
      }else{
        console.error('Invalid response format:', response);
      setError('Không thể lấy danh sách đơn hàng');
      }
    }catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response) {
        setError(error.response.data.message || 'Không thể lấy danh sách đơn hàng');
      } else if (error.request) {
        setError('Không thể kết nối đến máy chủ');
      } else {
        setError('Có lỗi xảy ra khi gửi yêu cầu');
      }
    
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'CARD': // Assuming 'CARD' is a payment method that implies successful payment (like delivered)
        return 'bg-green-100 text-green-800';
      case 'CASH': // Assuming 'CASH' is a payment method that implies pending payment (like pending)
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
    // Debugging logs to check actual status values
    console.log('Order Status for chip:', order.status);
    if (order.payments && order.payments.length > 0) {
      console.log('Payment Status for chip:', order.payments[0].paymentStatus);
      console.log('Payment Method for chip:', order.payments[0].paymentMethod);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      fetchOrders();
      handleCloseDialog();
    } catch(error) {
      console.error('Error updating order status:', error);
      setError('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Typography variant="h4" className="font-bold text-gray-800">
            Manage Orders
          </Typography>
        </div>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper className="p-4">
          <div className="mb-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search orders by order number or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order Number</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Total Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Order Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="textSecondary">
                            Không có đơn hàng nào
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.orderNumber}</TableCell>
                          <TableCell>{order.shippingName}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              className={getStatusColor(order.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleViewOrder(order)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalOrders}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Order Detail Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedOrder && (
            <>
              <DialogTitle>
                Order Details - {selectedOrder.orderNumber}
              </DialogTitle>
              <DialogContent>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Customer Information
                      </Typography>
                      <Typography>Name: {selectedOrder.shippingName}</Typography>
                      <Typography>Phone: {selectedOrder.shippingPhone}</Typography>
                      <Typography>Address: {selectedOrder.shippingAddress}</Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Order Information
                      </Typography>
                      <Typography>
                        Status:{' '}
                        <Chip
                          label={selectedOrder.status}
                          className={getStatusColor(selectedOrder.status)}
                          size="small"
                        />
                      </Typography>
                      <Typography>
                        Order Date:{' '}
                        {format(new Date(selectedOrder.createdAt), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <Typography variant="subtitle2" color="textSecondary" className="mb-2">
                      Order Items
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.orderItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="w-10 h-10 object-cover rounded"
                                  />
                                  <div>
                                    <Typography variant="body2">
                                      {item.productName}
                                    </Typography>
                                    {item.variantInfo && (
                                      <Typography variant="caption" color="textSecondary">
                                        {(() => {
                                          try {
                                            let parsedInfo = JSON.parse(item.variantInfo);

                                            // If the first parse results in a string, try parsing it again (handles double-encoded JSON)
                                            if (typeof parsedInfo === 'string') {
                                              parsedInfo = JSON.parse(parsedInfo);
                                            }

                                            // Ensure parsedInfo is an object before processing
                                            if (typeof parsedInfo === 'object' && parsedInfo !== null) {
                                              const variantDetails = Object.entries(parsedInfo)
                                                .filter(([key]) => key !== 'variantId') // Filter out 'variantId' as it's not needed for display
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(', ');
                                              return variantDetails;
                                            } else {
                                              // If after parsing, it's not an object, return the original string as fallback
                                              return item.variantInfo;
                                            }
                                          } catch (e) {
                                            console.error("Error parsing variantInfo:", e);
                                            return item.variantInfo; // Fallback to raw string if parsing fails
                                          }
                                        })()}
                                      </Typography>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                              <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Payment Information
                      </Typography>
                      <Typography>
                        Payment Status:{' '}
                        <Chip
                          label={selectedOrder.payments && selectedOrder.payments.length > 0
                            ? selectedOrder.payments[0].paymentStatus
                            : 'N/A'}
                          className={getStatusColor(selectedOrder.payments && selectedOrder.payments.length > 0
                            ? selectedOrder.payments[0].paymentStatus
                            : ''
                          )}
                          size="small"
                        />
                      </Typography>
                      <Typography>
                        Payment Method:{' '}
                        <Chip
                          label={selectedOrder.payments && selectedOrder.payments.length > 0
                            ? (selectedOrder.payments[0].paymentMethod || 'N/A')
                            : 'N/A'}
                          className={getStatusColor(selectedOrder.payments && selectedOrder.payments.length > 0
                            ? selectedOrder.payments[0].paymentMethod
                            : ''
                          )}
                          size="small"
                        />
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" color="textSecondary">
                        Order Summary
                      </Typography>
                      <Typography>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</Typography>
                      <Typography>Shipping: ${selectedOrder.shippingFee.toFixed(2)}</Typography>
                      <Typography>Tax: ${selectedOrder.taxAmount.toFixed(2)}</Typography>
                      {selectedOrder.discountAmount > 0 && (
                        <Typography>
                          Discount: -${selectedOrder.discountAmount.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="subtitle1" className="font-bold mt-2">
                        Total: ${selectedOrder.totalAmount.toFixed(2)}
                      </Typography>
                    </div>
                  </div>

                  <div>
                    <Typography variant="subtitle2" color="textSecondary" className="mb-2">
                      Update Order Status
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          handleUpdateStatus(selectedOrder.id, e.target.value)
                        }
                        label="Status"
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageOrders; 