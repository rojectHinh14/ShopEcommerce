import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  ShoppingCart as OrdersIcon,
  Inventory as ProductsIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

const StatCard = ({ title, value, icon, color }) => (
  <Card className="h-full">
    <CardContent>
      <div className="flex items-center justify-between">
        <div>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" className="font-bold">
            {value}
          </Typography>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  // These would typically come from your API/state management
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <PeopleIcon className="text-white" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '456',
      icon: <OrdersIcon className="text-white" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: '789',
      icon: <ProductsIcon className="text-white" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: '$12,345',
      icon: <RevenueIcon className="text-white" />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Dashboard Overview
        </Typography>

        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} className="mt-6">
          <Grid item xs={12} md={8}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                Recent Orders
              </Typography>
              <div className="space-y-4">
                {/* Placeholder for orders chart/table */}
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <Typography color="textSecondary">
                    Orders Chart/Table will be displayed here
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="p-4">
              <Typography variant="h6" className="mb-4">
                Top Products
              </Typography>
              <div className="space-y-4">
                {/* Placeholder for top products */}
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <Typography color="textSecondary">
                    Top Products will be displayed here
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 