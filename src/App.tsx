import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SalesView from "./views/SalesView";
import CommissionsView from "./views/CommissionsView";
import FormularioVenda from "./components/FormSales";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <div className="d-flex bg-light min-vh-100">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <div
          className="flex-grow-1 d-flex flex-column"
          style={{ paddingTop: "70px" }}
        >
          <Navbar onToggleMenu={() => setIsMenuOpen(true)} />

          <main className="p-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Navigate to="/vendas" replace />} />

              <Route path="/vendas" element={<SalesView />} />
              <Route path="/comissoes" element={<CommissionsView />} />

              <Route path="/vendas/nova" element={<FormularioVenda />} />
              <Route path="/vendas/editar/:id" element={<FormularioVenda />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
    </>
  );
};

export default App;
