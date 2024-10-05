import { Navigate, Route, Routes } from "react-router-dom"
import { useEffect } from "react"

import FloatingShape from "./components/FloatingShape"
import LoadingSpinner from "./components/LoadingSpinner"

import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import DashboardPage from "./pages/DashboardPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

import { useAuthStore } from "./store/authStore"

const RedirectAuthenticatedUser = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace/>
  }

  return children;
}

const ProtectRoute = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />
  }
  
  return children;
}

function App() {

  const { isCheckingAuth, checkAuth, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  if(isCheckingAuth) return <LoadingSpinner />
  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape color="bg-green-500" size='w-64 h-64' top='-5%' left='10%' delay={0}/>
      <FloatingShape color="bg-emerald-500" size='w-48 h-48' top='70%' left='80%' delay={5}/>
      <FloatingShape color="bg-lime-500" size='w-32 h-32' top='40%' left='-10%' delay={2}/>

      <Routes>
        <Route 
          path="/"
          element={
            <ProtectRoute>
              <DashboardPage />
            </ProtectRoute>
          }
        />
        <Route 
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route 
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <EmailVerificationPage />
          }
        />
        <Route 
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route 
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='*'
          element={
            <Navigate to='/' replace />
          } 
        />
      </Routes>
    </div>
  )
}

export default App
