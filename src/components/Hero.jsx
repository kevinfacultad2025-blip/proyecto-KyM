import { useEffect, useState } from "react";
import { Carousel, Image } from "react-bootstrap";

const DIAPOSITIVAS = [
    { src: "/media/carrusel-producto1.jpg", alt: "Hamburguesa de NombreDelLocal" },
    { src: "/media/carrusel-producto2.avif", alt: "Pizza de NombreDelLocal" },
    { src: "/media/carrusel-producto3.jpg", alt: "Sándwich de milanesa de NombreDelLocal" },
    { src: "/media/carrusel-producto4.jpg", alt: "Empanadas de NombreDelLocal" },
    { src: "/media/carrusel-producto5.avif", alt: "Postres de NombreDelLocal" }
];

const TIEMPO_ENTRE_IMAGENES = 4000;

function Hero() {
    // ---------- Carrusel ----------
    const [indiceActivo, setIndiceActivo] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndiceActivo(
                (indiceActual) => (indiceActual + 1) % DIAPOSITIVAS.length
            );
        }, TIEMPO_ENTRE_IMAGENES);

        return () => clearInterval(intervalo);
    }, [indiceActivo]);

    // ---------- Presentación de bienvenida ----------
    const [introVisible, setIntroVisible] = useState(
        () => sessionStorage.getItem("introVista") !== "si"
    );

    useEffect(() => {
        if (!introVisible) {
            return;
        }

        const temporizador = setTimeout(() => {
            sessionStorage.setItem("introVista", "si");
            setIntroVisible(false);
        }, 3000);

        return () => clearTimeout(temporizador);
    }, [introVisible]);

    return (
        <>
            {introVisible && (
                <section id="intro-screen" className="intro-screen">
                    <article className="intro-content text-center text-white">
                        <Image
                            src="/media/logo_local.png"
                            alt="Logo de NombreDelLocal"
                            className="intro-logo"
                        />

                        <h1 className="fw-bold">
                            ¡Bienvenidos a NombreDelLocal!
                        </h1>
                    </article>
                </section>
            )}

            <header id="inicio" className="hero position-relative">
                <Carousel
                    className="hero-carousel"
                    activeIndex={indiceActivo}
                    onSelect={setIndiceActivo}
                    interval={null}
                >
                    {DIAPOSITIVAS.map((diapositiva) => (
                        <Carousel.Item key={diapositiva.src}>
                            <img
                                src={diapositiva.src}
                                className="d-block w-100 h-100 object-fit-cover"
                                alt={diapositiva.alt}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>

                <section className="hero-overlay"></section>

                <section className="hero-content position-relative text-center text-white">
                    <Image
                        src="/media/logo_local.png"
                        alt="Logo de NombreDelLocal"
                        className="hero-logo"
                    />

                    <h1 className="display-4 fw-bold">
                        ¡Bienvenidos a NombreDelLocal!
                    </h1>
                </section>
            </header>
        </>
    );
}

export default Hero;