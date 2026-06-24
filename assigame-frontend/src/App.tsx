import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { MainLayout } from '@/components/layout/MainLayout'
import { SellerLayout } from '@/components/layout/SellerLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import CategoriesPage from '@/pages/CategoriesPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import AboutPage from '@/pages/AboutPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import SellerDashboardPage from '@/pages/seller/SellerDashboardPage'
import SellerProductsPage from '@/pages/seller/SellerProductsPage'
import SellerAddProductPage from '@/pages/seller/SellerAddProductPage'
import SellerEditProductPage from '@/pages/seller/SellerEditProductPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminSellersPage from '@/pages/admin/AdminSellersPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="produits" element={<ProductsPage />} />
            <Route path="produits/:slug" element={<ProductDetailPage />} />
            <Route path="a-propos" element={<AboutPage />} />
            <Route path="connexion" element={<LoginPage />} />
            <Route path="inscription" element={<RegisterPage />} />
          </Route>

          <Route
            path="vendeur"
            element={
              <ProtectedRoute role="seller">
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerDashboardPage />} />
            <Route path="produits" element={<SellerProductsPage />} />
            <Route path="produits/nouveau" element={<SellerAddProductPage />} />
            <Route path="produits/:id/modifier" element={<SellerEditProductPage />} />
          </Route>

          <Route
            path="admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="vendeurs" element={<AdminSellersPage />} />
            <Route path="produits" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
