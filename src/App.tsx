// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Creatives from './pages/Creatives';
import CreativeVideos from './pages/CreativeVideos';
import Design from './pages/Design';
import DevThemes from './pages/DevThemes';
import Sponsoring from './pages/Sponsoring';
import Social from './pages/Social';
import Settings from './pages/Settings';

// ✅ صفحة العناصر الخاصة بالديزاين (أنشئ DesignItems.tsx لو ما عندكش)
import DesignItems from './pages/DesignItems';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* صفحة تسجيل الدخول مفتوحة للجميع */}
          <Route path="/login" element={<Login />} />

          {/* كل ما تحت "/" محمي بالـ Auth */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* ري دايركت من / إلى /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />

            {/* Creatives */}
            <Route path="creatives" element={<Creatives />} />
            <Route path="creatives/:categoryId/videos" element={<CreativeVideos />} />

            {/* Design sections + items */}
            <Route path="design" element={<Design />} />
            <Route path="design/:sectionId/items" element={<DesignItems />} />

            {/* باقي الصفحات */}
            <Route path="dev-themes" element={<DevThemes />} />
            <Route path="sponsoring" element={<Sponsoring />} />
            <Route path="social" element={<Social />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* أي مسار غريب → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;