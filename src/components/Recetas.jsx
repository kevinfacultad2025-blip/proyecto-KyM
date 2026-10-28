import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";

function RecetasApi() {
    // 5. Guardar los datos obtenidos mediante useState
    const [recetas, setRecetas] = useState([]);
    
    // 8. Implementar un estado de carga
    const [cargando, setCargando] = useState(true);

    // 3. Utilizar la variable de entorno desde React (Vite)
    const API_URL = import.meta.env.VITE_API_URL;

    // 6. Realizar la petición dentro de useEffect
    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                setCargando(true);
                
                // 4. Realizar la petición utilizando Axios
                const response = await axios.get(API_URL);
                
                // Guardamos los resultados en el estado (dependiendo de la estructura de la API elegida)
                // En TheMealDB los datos vienen en response.data.meals
                setRecetas(response.data.meals || []);
            } catch (error) {
                console.error("Error al consumir la API:", error);
                
                // 9 y 10. Implementar manejo de errores y mostrar SweetAlert2
                Swal.fire({
                    icon: "error",
                    title: "¡Oops!",
                    text: "Hubo un error al cargar las recetas desde la API pública.",
                    confirmButtonText: "Entendido"
                });
            } finally {
                // Finaliza la carga (haya error o éxito)
                setCargando(false);
            }
        };

        obtenerDatos();
    }, [API_URL]);

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">Recetas Recomendadas de la API</h2>

            {/* 8. Mostrar indicador de carga */}
            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Cargando recetas...</p>
                </div>
            ) : (
                /* Mostrar los datos obtenidos en la interfaz */
                <Row className="g-4">
                    {recetas.map((receta) => (
                        <Col key={receta.idMeal} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100 shadow-sm">
                                <Card.Img 
                                    variant="top" 
                                    src={receta.strMealThumb} 
                                    alt={receta.strMeal} 
                                />
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className="h6 fw-bold">
                                        {receta.strMeal}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default RecetasApi;