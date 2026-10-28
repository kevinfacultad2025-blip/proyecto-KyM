import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);
  return null;
}

function NotFoundPage() {
  return <section className="section-wrap not-found-page" aria-labelledby="not-found-title">
    <span className="eyebrow">UPS, NOS PERDIMOS</span>
    <h1 id="not-found-title">Esta página no existe.</h1>
    <p>La dirección que ingresaste no está disponible. Podés volver al inicio o elegir tus empanadas.</p>
    <div className="hero-actions"><Link className="button button-primary" to="/">Volver al inicio</Link><Link className="button button-outline" to="/menu">Ver menú</Link></div>
  </section>;
}

function Rutas({ homePage, menuPage, pricesPage, orderPage, howPage, faqPage, contactPage }) {
  return <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={homePage} />
      <Route path="/menu" element={menuPage} />
      <Route path="/precios" element={pricesPage} />
      <Route path="/mi-pedido" element={orderPage} />
      <Route path="/como-comprar" element={howPage} />
      <Route path="/preguntas" element={faqPage} />
      <Route path="/contacto" element={contactPage} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>;
}

export default Rutas;
