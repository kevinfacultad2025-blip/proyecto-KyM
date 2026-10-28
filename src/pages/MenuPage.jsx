import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

import {
    productosPorCategoria,
    nombresCategorias,
    categorias
} from "../data/products";

import Menu from "../components/Menu";
import Submenu from "../components/Submenu";
import ProductModal from "../components/ProductModal";

function MenuPage({ agregarAlCarrito, formatearPrecio }) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [productoInfo, setProductoInfo] = useState(null);

    // Aviso "agregado al pedido"
    const [avisoVisible, setAvisoVisible] = useState(false);
    const [textoAviso, setTextoAviso] = useState("");

    function mostrarSubmenu(idCategoria) {
        if (!productosPorCategoria[idCategoria]) {
            return;
        }

        setCategoriaSeleccionada(idCategoria);

        setTimeout(() => {
            document
                .getElementById("submenu-productos")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }

    function volverAlMenu() {
        setCategoriaSeleccionada(null);

        setTimeout(() => {
            document
                .querySelector(".menu-categories")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }

    function manejarAgregar(id, nombre, precio) {
        agregarAlCarrito(id, nombre, precio);
        setTextoAviso(`${nombre} agregado al pedido`);
        setAvisoVisible(true);
    }

    return (
        <main>
            <Menu
                categorias={categorias}
                onSeleccionar={mostrarSubmenu}
            />

            {categoriaSeleccionada && (
                <Submenu
                    titulo={nombresCategorias[categoriaSeleccionada]}
                    productos={productosPorCategoria[categoriaSeleccionada]}
                    onVolver={volverAlMenu}
                    onAgregar={manejarAgregar}
                    onInfo={setProductoInfo}
                    formatearPrecio={formatearPrecio}
                />
            )}

            <ProductModal
                productoInfo={productoInfo}
                onClose={() => setProductoInfo(null)}
            />

            <ToastContainer
                position="bottom-end"
                className="position-fixed p-3"
            >
                <Toast
                    bg="success"
                    show={avisoVisible}
                    onClose={() => setAvisoVisible(false)}
                    delay={2500}
                    autohide
                >
                    <Toast.Body className="text-white fw-bold">
                        <i className="bi bi-check-circle"></i> {textoAviso}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </main>
    );
}

export default MenuPage;
