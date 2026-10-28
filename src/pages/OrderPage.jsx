import { useState } from "react";

import Cart from "../components/Cart";
import OrderForm from "../components/OrderForm";
import Confirmation from "../components/Confirmation";

const CUPONES_VALIDOS = {
    PRIMERPEDIDO: 15,
    PROMO10: 10
};

function OrderPage({
    carrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    calcularTotal,
    formatearPrecio
}) {
    // ==========================================================
    // ESTADOS DEL FORMULARIO (solo los usa esta page)
    // ==========================================================

    const [tipoEntrega, setTipoEntrega] = useState("delivery");
    const [metodoPago, setMetodoPago] = useState("efectivo");

    const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);
    const [codigoCupon, setCodigoCupon] = useState("");
    const [mensajeCupon, setMensajeCupon] = useState("");

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [montoEfectivo, setMontoEfectivo] = useState("");

    const [telefonoValido, setTelefonoValido] = useState(false);
    const [formularioEnviado, setFormularioEnviado] = useState(false);

    // ==========================================================
    // TOTAL CON DESCUENTO
    // ==========================================================

    function calcularTotalConDescuento() {
        const totalOriginal = calcularTotal();

        if (porcentajeDescuento > 0) {
            return totalOriginal - totalOriginal * (porcentajeDescuento / 100);
        }

        return totalOriginal;
    }

    // ==========================================================
    // CUPONES
    // ==========================================================

    function aplicarCupon() {
        const codigo = codigoCupon.trim().toUpperCase();

        if (CUPONES_VALIDOS[codigo]) {
            const descuento = CUPONES_VALIDOS[codigo];

            setPorcentajeDescuento(descuento);
            setMensajeCupon(
                `¡Cupón aplicado! Obtuviste un ${descuento}% de descuento.`
            );
        } else {
            setPorcentajeDescuento(0);
            setMensajeCupon("El código ingresado no es válido o ya venció.");
        }
    }

    // ==========================================================
    // TELÉFONO
    // ==========================================================

    function manejarTelefono(evento) {
        const valor = evento.target.value.replace(/[^0-9]/g, "");

        setTelefono(valor);
        setTelefonoValido(valor.length >= 10);
    }

    // ==========================================================
    // CONFIRMAR PEDIDO
    // ==========================================================

    function manejarEnvioFormulario(evento) {
        evento.preventDefault();

        const totalFinal = calcularTotalConDescuento();

        if (totalFinal <= 0) {
            window.alert(
                "Tu carrito está vacío. Agregá productos antes de confirmar."
            );
            return;
        }

        if (telefono.length < 10) {
            setTelefonoValido(false);
            return;
        }

        if (
            metodoPago === "efectivo" &&
            montoEfectivo !== "" &&
            Number(montoEfectivo) < totalFinal
        ) {
            return;
        }

        if (!nombre.trim()) {
            return;
        }

        if (tipoEntrega === "delivery" && !direccion.trim()) {
            return;
        }

        setFormularioEnviado(true);

        vaciarCarrito();
        setNombre("");
        setDireccion("");
        setTelefono("");
        setMontoEfectivo("");
        setCodigoCupon("");
        setPorcentajeDescuento(0);
        setMensajeCupon("");
        setTelefonoValido(false);

        setTimeout(() => {
            document
                .getElementById("confirmacion")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    }

    return (
        <main className="pt-5">
            <Cart
                carrito={carrito}
                cambiarCantidad={cambiarCantidad}
                eliminarDelCarrito={eliminarDelCarrito}
                formatearPrecio={formatearPrecio}
                calcularTotal={calcularTotal}
                porcentajeDescuento={porcentajeDescuento}
            />

            <OrderForm
                manejarEnvioFormulario={manejarEnvioFormulario}
                tipoEntrega={tipoEntrega}
                setTipoEntrega={setTipoEntrega}
                nombre={nombre}
                setNombre={setNombre}
                direccion={direccion}
                setDireccion={setDireccion}
                telefono={telefono}
                telefonoValido={telefonoValido}
                manejarTelefono={manejarTelefono}
                metodoPago={metodoPago}
                setMetodoPago={setMetodoPago}
                montoEfectivo={montoEfectivo}
                setMontoEfectivo={setMontoEfectivo}
                calcularTotalConDescuento={calcularTotalConDescuento}
                codigoCupon={codigoCupon}
                setCodigoCupon={setCodigoCupon}
                aplicarCupon={aplicarCupon}
                porcentajeDescuento={porcentajeDescuento}
                mensajeCupon={mensajeCupon}
            />

            <Confirmation formularioEnviado={formularioEnviado} />
        </main>
    );
}

export default OrderPage;
