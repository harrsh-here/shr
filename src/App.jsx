import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import Button from "./components/common/Button/Button";
import Navbar from "../src/components/Navbar/Navbar";
import Footer from "../src/components/Footer/Footer";
import Homepage from "./pages/Homepage";
import Loading from "./components/common/Loading/Loading";
import FloatingCartButton from "./components/common/Cart/FloatingCartButton";
import CartDrawer from "./components/common/Cart/CartDrawer";
import { useCart } from "./context/CartContext";
import Cursor from "./components/common/Cursor/Cursor";

/* Google Analytics */
import ReactGA from "react-ga";
const TRACKING_ID = "UA-257375779-1"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

// Lazy load non-critical routes for performance optimization
const MainEvents = React.lazy(() => import("./components/MainEvents/MainEvents"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const Register = React.lazy(() => import("./components/common/Register/Register"));
const ContactUs = React.lazy(() => import("./components/ContactUs/ContactUs"));
const Hidden = React.lazy(() => import("../src/components/Hidden/Hidden"));
// import SwupOverlayTheme from "@swup/overlay-theme";
// import Swup from "swup";

const App = () => {
  // const swup = new Swup({
  //   plugins: [
  //     new SwupOverlayTheme({
  //       color: "#2D2E82",
  //       duration: 500,
  //       direction: "to-right",
  //     }),
  //   ],
  // });
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [loading, setLoading] = useState(true);

  const { isCartOpen, setIsCartOpen } = useCart();

  const toggleCartDrawer = () => {
    setIsCartOpen(prev => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currPath = location.pathname;
    prevPathRef.current = currPath;

    // Detect if we are transitioning between the homepage and an event modal
    const isOpeningModal = prevPath === "/" && currPath.startsWith("/events/") && currPath !== "/events";
    const isClosingModal = prevPath.startsWith("/events/") && prevPath !== "/events" && (currPath === "/" || currPath === "/events");

    // Do not scroll if we are just opening or closing the event modal overlay
    if (!isOpeningModal && !isClosingModal) {
      if (location.hash) {
        setTimeout(() => {
          const id = location.hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            const yOffset = -80; // offset for nav bar
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>

          <Cursor />
          <Navbar />
          <React.Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/events" element={<MainEvents />} />
              <Route path="/events/:eventId" element={<Homepage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/hidden" element={<Hidden />} />
              {/*   <Route path="/leaderboard/:eventId" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />}></Route> */}
              {/* <Route path="/" element={<Landing />}></Route>  */}
              {/* <Route path="/" element={<Faq />}></Route>  */}
            </Routes>
          </React.Suspense>
          <Footer />
          <FloatingCartButton toggleDrawer={toggleCartDrawer} />
          <CartDrawer isOpen={isCartOpen} toggleDrawer={toggleCartDrawer} />
          {/* <Button /> */}
          {/* </div> */}
        </>
      )}
    </>
  );
};

export default App;
