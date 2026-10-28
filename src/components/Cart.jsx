import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";

function Cart({
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    formatearPrecio,
    calcularTotal,
    porcentajeDescuento
}) {
    return (
        <aside id="carrito" className="py-5 bg-white">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <Card className="shadow-sm brand-card">
                            <Card.Body className="p-4">
                                <Card.Title
                                    as="h2"
                                    className="h4 fw-bold mb-4 brand-title"
                                >
                                    Tu Carrito
                                </Card.Title>

                                <ListGroup variant="flush">
                                    {carrito.length === 0 ? (
                                        <ListGroup.Item className="text-center text-muted py-4">
                                            Todavía no agregaste productos al
                                            carrito.
                                        </ListGroup.Item>
                                    ) : (
                                        carrito.map((item) => (
                                            <ListGroup.Item
                                                key={item.id}
                                                className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 py-3"
                                            >
                                                <span className="fw-bold">
                                                    {item.nombre}
                                                </span>

                                                <section className="d-flex align-items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="brand-btn-primary"
                                                        onClick={() =>
                                                            cambiarCantidad(
                                                                item.id,
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </Button>

                                                    <span className="fw-bold px-2">
                                                        {item.cantidad}
                                                    </span>

                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="brand-btn-primary"
                                                        onClick={() =>
                                                            cambiarCantidad(
                                                                item.id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </section>

                                                <span className="fw-bold text-end">
                                                    {formatearPrecio(
                                                        item.precio *
                                                            item.cantidad
                                                    )}
                                                </span>

                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        eliminarDelCarrito(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>{" "}
                                                    Eliminar
                                                </Button>
                                            </ListGroup.Item>
                                        ))
                                    )}
                                </ListGroup>

                                <section className="d-flex justify-content-end mt-4">
                                    <p className="fs-5 fw-bold brand-title mb-0">
                                        Total:{" "}
                                        <span id="total-precio">
                                            {formatearPrecio(calcularTotal())}
                                        </span>
                                    </p>
                                </section>

                                {porcentajeDescuento > 0 && (
                                    <p className="text-success fw-bold text-end mt-2 mb-0">
                                        Descuento aplicado:{" "}
                                        {porcentajeDescuento}%
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </aside>
    );
}

export default Cart;
