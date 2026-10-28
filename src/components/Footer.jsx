import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Contact from "./Contact";

const ENLACES = [
    { texto: "Inicio", ruta: "/" },
    { texto: "Menú", ruta: "/menu" },
    { texto: "Mi pedido", ruta: "/mi-pedido" },
    { texto: "Sobre Nosotros", ruta: "/sobre-nosotros" },
    { texto: "Contacto", ruta: "/contacto" }
];

function Footer() {
    return (
        <footer className="brand-footer pt-5 pb-3 mt-5">
            <Container>
                <Row className="g-4">
                    <Col xs={12} md={4}>
                        <h3 className="h5 fw-bold">NombreDelLocal</h3>

                        <p>
                            Especialistas en <strong>entregar pedidos</strong>,
                            para su comodidad.
                        </p>
                    </Col>

                    <Col xs={12} md={4}>
                        <h3 className="h5 fw-bold">Enlaces</h3>

                        <ul className="list-unstyled">
                            {ENLACES.map((enlace) => (
                                <li key={enlace.ruta}>
                                    <Link
                                        to={enlace.ruta}
                                        className="brand-footer-link"
                                    >
                                        {enlace.texto}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>

                    <Col xs={12} md={4}>
                        <Contact />
                    </Col>
                </Row>

                <hr className="mt-4" />

                <p className="text-center small mb-0">
                    &copy; 2026 Delivery-app. Todos los derechos reservados.
                </p>
            </Container>
        </footer>
    );
}

export default Footer;
