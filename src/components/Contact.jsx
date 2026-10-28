function Contact({ conTitulo = true }) {
    return (
        <article>
            {conTitulo && <h3 className="h5 fw-bold">Contacto</h3>}

            <p className="mb-1">
                <i className="bi bi-envelope me-2"></i>
                delivery-app@gmail.com
            </p>

            <p className="mb-1">
                <i className="bi bi-telephone me-2"></i>
                +54 9 381 xxx xxxx
            </p>

            <p className="mb-0">
                <i className="bi bi-geo-alt me-2"></i>
                San Miguel de Tucumán, Argentina
            </p>
        </article>
    );
}

export default Contact;
