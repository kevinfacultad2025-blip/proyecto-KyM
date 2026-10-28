import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import Contact from "../components/Contact";

function ContactPage() {
    return (
        <main className="pt-5">
            <section className="py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={6}>
                            <Card className="shadow-sm brand-card">
                                <Card.Body className="p-4 p-md-5">
                                    <h1 className="h2 fw-bold brand-title text-center mb-2">
                                        Contacto
                                    </h1>

                                    <p className="text-muted text-center mb-4">
                                        ¿Tenés alguna consulta o querés hacer
                                        un pedido? Escribinos.
                                    </p>

                                    <Contact conTitulo={false} />

                                    <section className="d-grid mt-4">
                                        <Button
                                            as={Link}
                                            to="/menu"
                                            variant="primary"
                                            className="brand-btn-primary fw-bold"
                                        >
                                            <i className="bi bi-egg-fried me-1"></i>{" "}
                                            Ver el menú
                                        </Button>
                                    </section>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default ContactPage;
