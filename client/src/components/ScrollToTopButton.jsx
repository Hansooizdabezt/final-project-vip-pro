/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Lắng nghe sự kiện cuộn
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-gray-300 hover:text-white text-black p-3 w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 hover:opacity-100 opacity-70 transition duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}
