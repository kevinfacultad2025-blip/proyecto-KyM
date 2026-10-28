import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Error404Page() {
    return (
        <main className="pt-5">
            <Container className="py-5 text-center">
                <p className="display-1 fw-bold brand-precio mb-0">404</p>

                <h1 className="h3 fw-bold brand-title mb-3">
                    Página no encontrada
                </h1>

                <p className="text-muted mb-4">
                    La dirección que ingresaste no existe o fue movida.
                </p>

                <section className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button
                        as={Link}
                        to="/"
                        variant="primary"
                        className="brand-btn-primary fw-bold"
                    >
                        Volver al inicio
                    </Button>

                    <Button as={Link} to="/menu" variant="outline-dark">
                        Ver el menú
                    </Button>
                </section>
            </Container>
        </main>
    );
}

export default Error404Page;
