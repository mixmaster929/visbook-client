import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/index";
import Order from "./pages/order/index";
import SearchResult from "./pages/result/index";
import { useTranslation } from 'react-i18next';
// import "bootstrap/dist/css/bootstrap.min.css";

const VisBookComponent = () => {
  const { i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState();
  useEffect(() => {
    setCurrentLanguage(wpData?.currentLanguage);
    localStorage.setItem("lang", wpData?.currentLanguage);
    i18n.changeLanguage(wpData?.currentLanguage);
  }, []);

  console.log("currentLanguage=>", currentLanguage);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<SearchResult />} />
        <Route path="/order" element={<Order />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default VisBookComponent;
