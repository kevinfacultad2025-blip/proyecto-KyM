import { Col, Container, Row } from "react-bootstrap";

function Menu({ categorias, onSeleccionar }) {
    return (
        <section id="menu" className="menu-section">
            <Container>
                <header className="menu-header text-center">
                    <span className="menu-kicker">NUESTRO MENÚ</span>

                    <h2>¿Qué deseas comer hoy?</h2>

                    <p>Elegí una categoría para comenzar tu pedido</p>
                </header>

                <section className="menu-categories">
                    <Row className="g-4 justify-content-center">
                        {categorias.map((categoria) => (
                            <Col xs={12} sm={6} lg={4} key={categoria.id}>
                                <button
                                    type="button"
                                    className="category-card border-0 p-0 w-100"
                                    onClick={() => onSeleccionar(categoria.id)}
                                >
                                    <img
                                        src={categoria.imagen}
                                        alt={categoria.nombre}
                                        className="category-image"
                                    />

                                    <section className="category-overlay">
                                        <section className="category-content">
                                            <span className="category-number">
                                                {categoria.numero}
                                            </span>

                                            <h3>{categoria.nombre}</h3>

                                            <span className="category-action">
                                                Ver opciones{" "}
                                                <i className="bi bi-arrow-up-right"></i>
                                            </span>
                                        </section>
                                    </section>
                                </button>
                            </Col>
                        ))}
                    </Row>
                </section>
            </Container>
        </section>
    );
}

export default Menu;
