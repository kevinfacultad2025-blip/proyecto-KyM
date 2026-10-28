import { Button, Card, Col, Container, Row } from "react-bootstrap";

function Submenu({
    titulo,
    productos,
    onVolver,
    onAgregar,
    onInfo,
    formatearPrecio
}) {
    return (
        <section id="submenu-productos" className="pb-5">
            <Container>
                <header className="submenu-header text-center mb-4">
                    <Button
                        variant="outline-secondary"
                        className="mb-4"
                        onClick={onVolver}
                    >
                        <i className="bi bi-arrow-left"></i> Volver al menú
                    </Button>

                    <h3 className="submenu-titulo">{titulo}</h3>
                </header>

                <Row className="g-4 justify-content-center">
                    {productos.map((producto) => (
                        <Col xs={12} md={6} lg={4} key={producto.id}>
                            <Card className="submenu-producto-card h-100">
                                <Card.Img
                                    variant="top"
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="submenu-producto-imagen"
                                />

                                <Card.Body className="submenu-producto-body">
                                    <Card.Title
                                        as="h4"
                                        className="submenu-producto-nombre"
                                    >
                                        {producto.nombre}
                                    </Card.Title>

                                    <Card.Text className="submenu-producto-precio">
                                        {formatearPrecio(producto.precio)}
                                    </Card.Text>

                                    <section className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            className="brand-btn-primary"
                                            onClick={() =>
                                                onAgregar(
                                                    producto.id,
                                                    producto.nombre,
                                                    producto.precio
                                                )
                                            }
                                        >
                                            <i className="bi bi-cart-plus"></i>{" "}
                                            Agregar al pedido
                                        </Button>

                                        <Button
                                            variant="outline-dark"
                                            onClick={() => onInfo(producto)}
                                        >
                                            <i className="bi bi-info-circle"></i>{" "}
                                            Más información
                                        </Button>
                                    </section>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}

export default Submenu;
