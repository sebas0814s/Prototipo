import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import WhatsAppButton from './components/common/WhatsAppButton';
import RequireAdmin   from './components/admin/RequireAdmin';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';

/* Páginas públicas */
import Home          from './pages/Home';
import Products      from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart          from './pages/Cart';
import Checkout      from './pages/Checkout';
import Login         from './pages/Login';
import Profile       from './pages/Profile';
import About         from './pages/About';

/* Páginas admin */
import AdminLogin     from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsAdmin  from './pages/admin/ProductsAdmin';
import ProductForm    from './pages/admin/ProductForm';

/* Wrapper de la tienda pública (Navbar + Footer) */
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 60 * 5 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ── Admin (sin navbar/footer público) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireAdmin>
                <ProductsAdmin />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <RequireAdmin>
                <ProductForm />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <RequireAdmin>
                <ProductForm />
              </RequireAdmin>
            }
          />

          {/* ── Tienda pública ── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
          <Route path="/about"   element={<PublicLayout><About /></PublicLayout>} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
