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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import { productService } from '../../services/productService';
import { toast } from 'react-toastify';
import ProductForm from '../components/ProductForm';

// Thêm base URL cho server file
const FILE_SERVER_BASE_URL = 'http://localhost:8080'; // Base URL cho server phục vụ file (thường cùng cổng với API)

const ManageProducts = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  // Hàm helper để tạo URL đầy đủ cho ảnh sản phẩm
  const getProductImageUrl = (path) => {
    if (!path) return null; // Trả về null nếu không có đường dẫn
    
    // Nếu đường dẫn từ backend bắt đầu bằng tiền tố cổng 8082, thay thế bằng cổng 8080
    if (path.startsWith('http://localhost:8082/file/images-product/')) {
      return path.replace('http://localhost:8082', 'http://localhost:8080');
    }
    // Nếu đường dẫn từ backend đã là URL đầy đủ (bắt đầu bằng http) nhưng không phải cổng 8082, sử dụng nó trực tiếp.
    if (path.startsWith('http')) {
      return path;
    }
    // Nếu không phải là URL đầy đủ, ghép với FILE_SERVER_BASE_URL (cổng 8080) và /file/images-product/
    // (Lưu ý: dựa vào cấu hình backend, đường dẫn này có thể cần khớp với storage.product.relative.path)
    // Tuy nhiên, vì backend trả về URL đầy đủ 8082, trường hợp này ít có khả năng xảy ra.
    // Giữ lại logic phòng hờ hoặc nếu cấu hình backend thay đổi.
    return `${FILE_SERVER_BASE_URL}/file/images-product/${path.split('/').pop()}`;
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        size: rowsPerPage,
        sortBy: 'createdAt',
        sortDir: 'desc',
        keyword: searchQuery || undefined,
        categoryId: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      };

      const response = await productService.searchProducts(params);
      if (response.success) {
        setProducts(response.data.content);
        setTotalProducts(response.data.totalElements);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, searchQuery, categoryFilter, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedProduct) return;

      const response = await productService.deleteProduct(selectedProduct.id);
      if (response.success) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while deleting the product');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await productService.updateProductStatus(productId, newStatus);
      if (response.success) {
        toast.success('Product status updated successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error(response.message || 'Failed to update product status');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while updating product status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchProducts();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Typography variant="h4" className="font-bold text-gray-800">
            Manage Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Paper className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
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
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="1">Clothing</MenuItem>
                <MenuItem value="2">Accessories</MenuItem>
                <MenuItem value="3">Electronics</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Bulk Import
            </Button>
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
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Avatar
                            // Sử dụng hàm helper để lấy URL ảnh, lấy ảnh đầu tiên từ danh sách imageUrls
                            src={getProductImageUrl(product.imageUrls?.[0])}
                            alt={product.name}
                            variant="rounded"
                            className="w-10 h-10"
                          >
                            <ImageIcon />
                          </Avatar>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category?.name}</TableCell>
                        <TableCell>${product.price?.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.status}
                            className={getStatusColor(product.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditProduct(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            className="text-red-600 hover:text-red-800 ml-2"
                            onClick={() => handleDeleteClick(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalProducts}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        <ProductForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
          editProduct={selectedProduct}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the product "{selectedProduct?.name}"?
            This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageProducts; 