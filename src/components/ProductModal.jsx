import { Modal, Ratio } from "react-bootstrap";

function ProductModal({ productoInfo, onClose }) {
    if (!productoInfo) {
        return null;
    }

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title as="h3" className="brand-title fw-bold">
                    {productoInfo.nombre}
                </Modal.Title>
            </Modal.Header>

            <Ratio aspectRatio="16x9">
                <img
                    src={productoInfo.imagen}
                    alt={productoInfo.nombre}
                    className="object-fit-cover"
                />
            </Ratio>

            <Modal.Body>
                <h6 className="fw-bold mb-2">Ingredientes</h6>

                <ul className="mb-3">
                    {productoInfo.ingredientes.map((ingrediente) => (
                        <li key={ingrediente}>{ingrediente}</li>
                    ))}
                </ul>

                <h6 className="fw-bold mb-2">Elaboración</h6>

                <p className="text-muted mb-0">
                    {productoInfo.elaboracion}
                </p>
            </Modal.Body>
        </Modal>
    );
}

export default ProductModal;
