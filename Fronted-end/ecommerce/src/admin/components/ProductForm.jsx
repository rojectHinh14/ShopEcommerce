import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  IconButton,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, ExpandMore as ExpandMoreIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { productService } from '../../services/productService';
import { toast } from 'react-toastify';
import { categoryService } from '../../services/categoryService';

const ProductForm = ({ open, onClose, onSuccess, editProduct = null }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    stock: '',
    stockQuantity: '',
    categoryId: '',
    status: 'ACTIVE',
    imageBase64s: [],
    existingImageUrls: editProduct?.imageUrls || [],
    variants: [],
    skuCode: '',
    weight: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name || '',
        description: editProduct.description || '',
        shortDescription: editProduct.shortDescription || '',
        price: editProduct.price || '',
        originalPrice: editProduct.originalPrice || '',
        stock: editProduct.stock || '',
        stockQuantity: editProduct.stockQuantity || '',
        categoryId: editProduct.category?.id || '',
        status: editProduct.status || 'ACTIVE',
        imageBase64s: [],
        existingImageUrls: editProduct.imageUrls || [],
        variants: editProduct.variants || [],
        skuCode: editProduct.skuCode || '',
        weight: editProduct.weight || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        price: '',
        originalPrice: '',
        stock: '',
        stockQuantity: '',
        categoryId: '',
        status: 'ACTIVE',
        imageBase64s: [],
        existingImageUrls: [],
        variants: [],
        skuCode: '',
        weight: '',
      });
    }
  }, [editProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getAllCategories();
        if (response.success) {
          setCategories(response.data);
        } else {
          toast.error(response.message || 'Failed to fetch categories');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.variants.length === 0) {
      if (!formData.stockQuantity && formData.stockQuantity !== 0) newErrors.stockQuantity = 'Stock quantity is required for simple product';
      if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
        newErrors.stockQuantity = 'Stock quantity must be a non-negative number';
      }
    } else {
      if (formData.variants.length === 0) {
        newErrors.variants = 'At least one variant is required if product has variants';
      } else {
        formData.variants.forEach((variant, index) => {
          const variantErrors = {};
          if (!variant.variantName) variantErrors.variantName = 'Variant Name is required';
          if (!variant.variantValue) variantErrors.variantValue = 'Variant Value is required';
          if (!variant.price && variant.price !== 0) variantErrors.price = 'Price is required';
          if (isNaN(parseFloat(variant.price)) || parseFloat(variant.price) < 0) {
            variantErrors.price = 'Price must be a non-negative number';
          }
          if (!variant.stockQuantity && variant.stockQuantity !== 0) variantErrors.stockQuantity = 'Stock quantity is required';
          if (isNaN(parseInt(variant.stockQuantity)) || parseInt(variant.stockQuantity) < 0) {
            variantErrors.stockQuantity = 'Stock quantity must be a non-negative number';
          }

          if (Object.keys(variantErrors).length > 0) {
            if (!newErrors.variants) newErrors.variants = [];
            newErrors.variants[index] = variantErrors;
          }
        });
      }
      if (formData.stockQuantity && (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0)) {
        newErrors.stockQuantity = 'Product-level stock quantity must be a non-negative number if provided';
      }
    }
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.imageBase64s.length + formData.existingImageUrls.length === 0 && (formData.variants.length === 0 || formData.variants.every(v => !v.imageUrl))) {
      newErrors.images = 'At least one image is required for the product or its variants';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && (!newErrors.variants || newErrors.variants.filter(Boolean).length === 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }

    try {
      setLoading(true);
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stockQuantity: formData.variants.length > 0 ? null : parseInt(formData.stockQuantity),
        categoryId: formData.categoryId,
        status: formData.status,
        imageBase64s: formData.imageBase64s,
        variants: formData.variants.map(variant => ({
          variantName: variant.variantName,
          variantValue: variant.variantValue,
          price: parseFloat(variant.price),
          stockQuantity: parseInt(variant.stockQuantity),
          skuCode: variant.skuCode || null,
          imageUrl: variant.imageUrl || null,
        })),
        skuCode: formData.skuCode || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      delete productData.stock;

      console.log('Submitting product data:', productData);

      let response;
      if (editProduct) {
        response = await productService.updateProduct(editProduct.id, productData);
      } else {
        response = await productService.createProduct(productData);
      }

      if (response.success) {
        toast.success(editProduct ? 'Product updated successfully' : 'Product created successfully');
        onSuccess();
        onClose();
      } else {
        console.error('Backend response error:', response);
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Frontend submission error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageBase64s: [...prev.imageBase64s, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageBase64s: prev.imageBase64s.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      existingImageUrls: prev.existingImageUrls.filter((_, i) => i !== index)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { variantName: '', variantValue: '', price: '', stockQuantity: '', skuCode: '', imageUrl: '' }]
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editProduct ? 'Edit Product' : 'Add New Product'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Original Price"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                error={!!errors.originalPrice}
                helperText={errors.originalPrice}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU Code (Product)"
                value={formData.skuCode}
                onChange={(e) => setFormData(prev => ({ ...prev, skuCode: e.target.value }))}
                error={!!errors.skuCode}
                helperText={errors.skuCode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>

            {formData.variants.length === 0 && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                  error={!!errors.stockQuantity}
                  helperText={errors.stockQuantity}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.categoryId} required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  label="Category"
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && (
                  <Typography color="error" variant="caption">
                    {errors.categoryId}
                  </Typography>
                )}
                {loading && (
                  <Typography variant="caption" className="text-gray-500">
                    Loading categories...
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  label="Status"
                >
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Variants
              </Typography>
              <Button onClick={addVariant} startIcon={<AddIcon />} variant="outlined" size="small">
                Add Variant
              </Button>

              <Box mt={2}>
                {formData.variants.map((variant, index) => (
                  <Accordion key={index} defaultExpanded={true}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{variant.variantName || `Variant ${index + 1}`}</Typography>
                      {errors.variants && errors.variants[index] && (
                        <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                          (Fix errors below)
                        </Typography>
                      )}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Variant Name"
                            value={variant.variantName}
                            onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.variantName)}
                            helperText={errors.variants && errors.variants[index]?.variantName}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Variant Value"
                            value={variant.variantValue}
                            onChange={(e) => updateVariant(index, 'variantValue', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.variantValue)}
                            helperText={errors.variants && errors.variants[index]?.variantValue}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Price (Variant)"
                            type="number"
                            value={variant.price}
                            onChange={(e) => updateVariant(index, 'price', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.price)}
                            helperText={errors.variants && errors.variants[index]?.price}
                            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Stock Quantity (Variant)"
                            type="number"
                            value={variant.stockQuantity}
                            onChange={(e) => updateVariant(index, 'stockQuantity', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.stockQuantity)}
                            helperText={errors.variants && errors.variants[index]?.stockQuantity}
                            InputProps={{ inputProps: { min: 0 } }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="SKU Code (Variant)"
                            value={variant.skuCode}
                            onChange={(e) => updateVariant(index, 'skuCode', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.skuCode)}
                            helperText={errors.variants && errors.variants[index]?.skuCode}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Image URL (Variant)"
                            value={variant.imageUrl}
                            onChange={(e) => updateVariant(index, 'imageUrl', e.target.value)}
                            error={!!(errors.variants && errors.variants[index]?.imageUrl)}
                            helperText={errors.variants && errors.variants[index]?.imageUrl}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => removeVariant(index)}
                          >
                            Remove Variant
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              {errors.variants && typeof errors.variants === 'string' && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.variants}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Images
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="raised-button-file">
                <Button variant="outlined" component="span" startIcon={<AddIcon />}>
                  Upload Images
                </Button>
              </label>
              {errors.images && (
                <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                  {errors.images}
                </Typography>
              )}

              <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                {formData.existingImageUrls.map((url, index) => (
                  <Chip
                    key={`existing-${index}`}
                    label={url.split('/').pop()}
                    onDelete={() => removeExistingImage(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {formData.imageBase64s.map((base64, index) => (
                  <Chip
                    key={`new-${index}`}
                    label={`New Image ${index + 1}`}
                    onDelete={() => removeNewImage(index)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm; 