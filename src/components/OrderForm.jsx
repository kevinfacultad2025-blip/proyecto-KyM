import {
    Alert,
    Button,
    ButtonGroup,
    Card,
    Col,
    Container,
    Form,
    InputGroup,
    Row,
    ToggleButton
} from "react-bootstrap";

function OrderForm({
    manejarEnvioFormulario,
    tipoEntrega,
    setTipoEntrega,
    nombre,
    setNombre,
    direccion,
    setDireccion,
    telefono,
    telefonoValido,
    manejarTelefono,
    metodoPago,
    setMetodoPago,
    montoEfectivo,
    setMontoEfectivo,
    calcularTotalConDescuento,
    codigoCupon,
    setCodigoCupon,
    aplicarCupon,
    porcentajeDescuento,
    mensajeCupon
}) {
    return (
        <section id="pedido" className="py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-sm brand-card">
                            <Card.Body className="p-4 p-md-5">
                                <Card.Title
                                    as="h2"
                                    className="text-center fw-bold mb-4 brand-title"
                                >
                                    Confirmar Pedido
                                </Card.Title>

                                <Form onSubmit={manejarEnvioFormulario}>
                                    <Row className="g-3">
                                        <Col xs={12} className="mb-2">
                                            <Form.Label className="fw-semibold d-block">
                                                Modo de entrega
                                            </Form.Label>

                                            <ButtonGroup
                                                className="w-100"
                                                aria-label="Modo de entrega"
                                            >
                                                <ToggleButton
                                                    id="entrega-delivery"
                                                    type="radio"
                                                    variant="outline-primary"
                                                    className="fw-bold"
                                                    name="tipo-entrega"
                                                    value="delivery"
                                                    checked={
                                                        tipoEntrega ===
                                                        "delivery"
                                                    }
                                                    onChange={(evento) =>
                                                        setTipoEntrega(
                                                            evento.currentTarget
                                                                .value
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-truck me-1"></i>{" "}
                                                    Delivery
                                                </ToggleButton>

                                                <ToggleButton
                                                    id="entrega-retiro"
                                                    type="radio"
                                                    variant="outline-primary"
                                                    className="fw-bold"
                                                    name="tipo-entrega"
                                                    value="retiro"
                                                    checked={
                                                        tipoEntrega ===
                                                        "retiro"
                                                    }
                                                    onChange={(evento) =>
                                                        setTipoEntrega(
                                                            evento.currentTarget
                                                                .value
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-shop me-1"></i>{" "}
                                                    Retirar en local
                                                </ToggleButton>
                                            </ButtonGroup>
                                        </Col>

                                        <Col xs={12}>
                                            <Form.Group controlId="nombre">
                                                <Form.Label className="fw-semibold">
                                                    Nombre completo
                                                </Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    value={nombre}
                                                    onChange={(evento) =>
                                                        setNombre(
                                                            evento.target.value
                                                        )
                                                    }
                                                    required
                                                    placeholder="Ej: Juan Pérez"
                                                />
                                            </Form.Group>
                                        </Col>

                                        {tipoEntrega === "delivery" && (
                                            <Col xs={12}>
                                                <Form.Group controlId="direccion">
                                                    <Form.Label className="fw-semibold">
                                                        Dirección de entrega
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="text"
                                                        value={direccion}
                                                        onChange={(evento) =>
                                                            setDireccion(
                                                                evento.target
                                                                    .value
                                                            )
                                                        }
                                                        required
                                                        placeholder="Ej: Av. Alem 123"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        )}

                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="telefono">
                                                <Form.Label className="fw-semibold">
                                                    Teléfono / WhatsApp
                                                </Form.Label>

                                                <Form.Control
                                                    type="tel"
                                                    value={telefono}
                                                    onChange={manejarTelefono}
                                                    isValid={
                                                        telefono.length > 0 &&
                                                        telefonoValido
                                                    }
                                                    isInvalid={
                                                        telefono.length > 0 &&
                                                        !telefonoValido
                                                    }
                                                    required
                                                    placeholder="Ej: 3811234567"
                                                />

                                                <Form.Control.Feedback type="invalid">
                                                    Ingresá un número válido de
                                                    mínimo 10 dígitos.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="metodo-pago">
                                                <Form.Label className="fw-semibold">
                                                    Método de pago
                                                </Form.Label>

                                                <Form.Select
                                                    value={metodoPago}
                                                    onChange={(evento) =>
                                                        setMetodoPago(
                                                            evento.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="efectivo">
                                                        Efectivo
                                                    </option>

                                                    <option value="transferencia">
                                                        Transferencia
                                                    </option>

                                                    <option value="tarjeta">
                                                        Tarjeta (POSNET al
                                                        entregar)
                                                    </option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        {metodoPago === "efectivo" && (
                                            <Col xs={12}>
                                                <Form.Group controlId="monto-efectivo">
                                                    <Form.Label className="fw-semibold">
                                                        ¿Con cuánto vas a pagar?{" "}
                                                        <small className="text-muted">
                                                            (para llevar cambio)
                                                        </small>
                                                    </Form.Label>

                                                    <Form.Control
                                                        type="number"
                                                        min="0"
                                                        value={montoEfectivo}
                                                        onChange={(evento) =>
                                                            setMontoEfectivo(
                                                                evento.target
                                                                    .value
                                                            )
                                                        }
                                                        isInvalid={
                                                            montoEfectivo !==
                                                                "" &&
                                                            Number(
                                                                montoEfectivo
                                                            ) <
                                                                calcularTotalConDescuento()
                                                        }
                                                        placeholder="Ej: 10000"
                                                    />

                                                    <Form.Control.Feedback type="invalid">
                                                        El monto ingresado debe
                                                        ser mayor o igual al
                                                        total a pagar.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        )}

                                        {metodoPago === "transferencia" && (
                                            <Col xs={12}>
                                                <Alert
                                                    variant="info"
                                                    className="border-0 shadow-sm mb-0"
                                                >
                                                    <p className="fw-bold mb-1">
                                                        <i className="bi bi-bank me-1"></i>{" "}
                                                        Datos para transferir:
                                                    </p>

                                                    <p className="small mb-1">
                                                        <strong>Alias:</strong>{" "}
                                                        nombredellocal.mp
                                                    </p>

                                                    <p className="small mb-0">
                                                        <strong>CBU:</strong>{" "}
                                                        0000003100012345678901
                                                    </p>
                                                </Alert>
                                            </Col>
                                        )}

                                        <Col xs={12} className="mt-3">
                                            <Form.Group controlId="codigo-descuento">
                                                <Form.Label className="fw-semibold">
                                                    Código de descuento
                                                </Form.Label>

                                                <InputGroup>
                                                    <Form.Control
                                                        type="text"
                                                        className="text-uppercase"
                                                        value={codigoCupon}
                                                        onChange={(evento) =>
                                                            setCodigoCupon(
                                                                evento.target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Ej: PRIMERPEDIDO"
                                                        disabled={
                                                            porcentajeDescuento >
                                                            0
                                                        }
                                                    />

                                                    <Button
                                                        variant="outline-secondary"
                                                        className="fw-bold"
                                                        onClick={aplicarCupon}
                                                        disabled={
                                                            porcentajeDescuento >
                                                            0
                                                        }
                                                    >
                                                        Aplicar
                                                    </Button>
                                                </InputGroup>

                                                {mensajeCupon && (
                                                    <Form.Text
                                                        as="p"
                                                        className={`mt-1 fw-bold ${
                                                            porcentajeDescuento >
                                                            0
                                                                ? "text-success"
                                                                : "text-danger"
                                                        }`}
                                                    >
                                                        {mensajeCupon}
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} className="mt-4">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="brand-btn-primary w-100 py-2 fw-bold"
                                            >
                                                <i className="bi bi-check-circle me-1"></i>{" "}
                                                Confirmar Pedido
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default OrderForm;
