import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../PageLoader/ProtectedRoute";
import PublicRoute from "../PageLoader/PublicRoute";
import MainLayout from "../layouts/MainLayout";
import { PageLoader } from "../components/Loading/LoadingSpinner";
import OAuthSuccess from "../pages/Oauthsuccess";
import LandingPage from './../pages/LandingPage';
import Park from './../pages/Park';
import Settings from "../pages/Settings";
import Manage from './../pages/Manage/Manage';


const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/Forgotpassword"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const NotFound = lazy(() => import("../pages/NotFound"));




const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
          <Route path="/" element={<LandingPage />} />

        {/* Public-only — bounce to /dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Google OAuth redirect target — not wrapped in PublicRoute since
            it needs to run even mid-login, before a token exists yet */}
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected — require a token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashBoard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Manage/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/parking"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Park/>
              </MainLayout>
            </ProtectedRoute>
          }
        />
         <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings/>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;