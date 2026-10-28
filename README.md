# K&M Empanadas — sitio de pedidos

Sitio de una sola página desarrollado con React + Vite para mostrar sabores y precios, armar pedidos combinando empanadas y preparar un mensaje para WhatsApp.

## Funciones incluidas

- Sabores disponibles: pollo, carne y mondongo.
- Precios configurados en `src/data/business.js`: unidad, media docena, docena y promo de dos docenas.
- Armador de pedidos con control de cantidades y combinación de sabores.
- Carrito para editar, duplicar, quitar o vaciar productos.
- Persistencia local del pedido y de las preferencias de entrega/pago.
- Retiro en Saavedra 1426 o envío a coordinar; no se inventa tarifa ni cobertura exacta.
- Efectivo o transferencia, con las condiciones indicadas antes de generar el mensaje.
- Mensaje de pedido preparado para cualquiera de los dos WhatsApp configurados.
- Diseño adaptable a móvil, navegación accesible, aviso de estado y fallback de mensaje copiable.
- Ilustración vectorial original; no se presenta como foto real del producto.

## Requisitos

Node.js compatible con la versión de Vite usada por el proyecto y npm.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Verificaciones

```bash
npm test
npm run lint
npm run build
```

`npm test` usa el test runner incorporado de Node.js y no necesita instalar un framework de pruebas adicional.

## Datos comerciales

Editar `src/data/business.js` para actualizar precios, sabores, teléfonos, dirección o textos del negocio. Antes de publicar, confirmar que los dos números de WhatsApp estén activos y que la dirección, días habituales, forma de pago y condiciones de entrega sigan siendo correctos.

## Importante sobre WhatsApp

El sitio prepara un mensaje en WhatsApp. No envía el mensaje, no acepta pedidos automáticamente y no confirma disponibilidad. La persona debe revisar y enviar el mensaje, y esperar la confirmación del negocio. El costo de envío se coordina aparte.

## Publicación

La carpeta `dist/` se genera con `npm run build`; no se incluye una compilación previa porque podría quedar desactualizada. Revisar la web localmente y publicar desde una rama de trabajo antes de fusionar a `main`.
