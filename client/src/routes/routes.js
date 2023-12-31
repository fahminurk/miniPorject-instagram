import { Route } from "react-router-dom";
import RegisterPage from "../pages/registerPage";
import LoginPage from "../pages/loginPage";
import ProfilePage from "../pages/profilePage";
import HomePage from "../pages/homePage";
import ForgotPasswordPage from "../pages/forgotPasswordPage";
import ChangePasswordPage from "../pages/changePasswordPage";
import ProtectedPage from "./protectedPage";
import VerifPage from "../pages/verifPage";
import PostDetailPage from "../pages/postDetailPage";
import NavbarProfile, { NavbarPhoto } from "../components/navbarProfile";
import Footer from "../components/Footer";
import NavbarHome from "../components/navbarHome";
import TestPage from "../pages/test";

const routes = [
  <Route
    path="/signup"
    element={
      <ProtectedPage guestOnly={true}>
        <RegisterPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/login"
    element={
      <ProtectedPage guestOnly={true}>
        <LoginPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/profile"
    element={
      <ProtectedPage needLogin={true}>
        <NavbarProfile />
        <ProfilePage />
        <Footer />
      </ProtectedPage>
    }
  />,
  <Route
    path="/post/:id"
    element={
      <ProtectedPage needLogin={true}>
        <NavbarPhoto />
        <PostDetailPage />
        <Footer />
      </ProtectedPage>
    }
  />,
  <Route
    path="/forgot-password"
    element={
      <ProtectedPage guestOnly={true}>
        <ForgotPasswordPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/home"
    element={
      <ProtectedPage needLogin={true}>
        <NavbarHome />
        <HomePage />
        {/* <Footer /> */}
      </ProtectedPage>
    }
  />,
  <Route
    path="/forgot-password/:token"
    element={
      <ProtectedPage guestOnly={true}>
        <ChangePasswordPage />
      </ProtectedPage>
    }
  />,
  <Route
    path="/update-verif/:token"
    element={
      <ProtectedPage needLogin={true}>
        <VerifPage />
      </ProtectedPage>
    }
  />,

  <Route
    path="/*"
    element={<ProtectedPage needLogin={true} guestOnly={true} />}
  />,
  <Route path="/test" element={<TestPage />} />,
];

export default routes;
