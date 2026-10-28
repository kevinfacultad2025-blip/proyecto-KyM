import { Alert, Col, Container, Row } from "react-bootstrap";

function Confirmation({ formularioEnviado }) {
    if (!formularioEnviado) {
        return null;
    }

    return (
        <section id="confirmacion" className="py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Alert
                            variant="success"
                            className="text-center p-4 shadow-sm"
                        >
                            <h2 className="h4 fw-bold">
                                ¡Pedido Confirmado!
                            </h2>

                            <p className="mb-1">
                                Gracias por tu compra. Tu pedido está siendo
                                preparado.
                            </p>

                            <p className="fw-bold mb-0">
                                ¡Muchas gracias por elegirnos!
                            </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default Confirmation;
