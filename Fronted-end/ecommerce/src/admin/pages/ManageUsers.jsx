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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';
import { userService } from '../../services/userService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ManageUsers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers(page, rowsPerPage);
      console.log("response" , response)
      setUsers(response.data.content);

      console.log("users" , response.data.totalElements);
      setTotalUsers(response.data.totalElements);
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await userService.searchUsers(searchQuery, page, rowsPerPage);
      setUsers(response.data.content);
      setTotalUsers(response.data.totalElements);
    } catch (err) {
      setError('Failed to search users');
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditUser = (user) => {
    console.log('Editing user:', user);
    const userWithFormattedRole = {
      ...user,
      role: user.role.map(r => typeof r === 'string' ? { name: r } : r)
    };
    setSelectedUser(userWithFormattedRole);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editMode) {
        console.log('Current userData:', userData);
        console.log('Current selectedUser:', selectedUser);
        
        const roleObject = {
          name: userData.role[0]?.name || userData.role[0]
        };
        
        const updateData = {
          isActive: userData.isActive,
          roles: [roleObject]
        };
        
        console.log('Sending update data:', updateData);
        
        const response = await userService.updateUser(selectedUser.id, updateData);
        console.log('Update response:', response);
        
        toast.success('User updated successfully');
        setOpenDialog(false);
        fetchUsers();
      }
    } catch (err) {
      console.error('Error updating user:', err);
      console.error('Error details:', err.response?.data);
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ROLE_USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Typography variant="h4" className="font-bold text-gray-800">
            Manage Users
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add User
          </Button>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Paper className="p-4">
          <div className="mb-4">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by username or email..."
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
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.role.map((role, index) => (
                            <Chip
                              key={index}
                              label={role.name}
                              className={`${getRoleColor(role.name)} mr-1`}
                              size="small"
                            />
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.active ? 'Active' : 'Inactive'}
                            className={getStatusColor(user.active)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            className="text-red-600 hover:text-red-800 ml-2"
                            onClick={() => handleDeleteUser(user.id)}
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
                count={totalUsers}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Edit User Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <div className="space-y-4 mt-4">
                <TextField
                  fullWidth
                  label="Username"
                  defaultValue={selectedUser.username}
                  disabled={true}
                />
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={selectedUser.email}
                  disabled={true}
                />
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={selectedUser?.role[0]?.name || ''}
                    label="Role"
                    onChange={(e) => {
                      const newRole = { name: e.target.value };
                      console.log('Selected new role:', newRole);
                      setSelectedUser(prev => ({
                        ...prev,
                        role: [newRole]
                      }));
                    }}
                  >
                    <MenuItem value="ROLE_USER">User</MenuItem>
                    <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    defaultValue={selectedUser.isActive}
                    label="Status"
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      isActive: e.target.value
                    })}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={() => handleSaveUser(selectedUser)} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers; 