export function validateCheckout({ mode, surname, address }) {
  const errors = {};
  if (mode === "delivery") {
    if (!String(surname ?? "").trim()) errors.surname = "Ingresá tu apellido.";
    else if (String(surname).trim().length > 80) errors.surname = "El apellido no puede superar los 80 caracteres.";
    if (!String(address ?? "").trim()) errors.address = "Ingresá la dirección exacta de entrega.";
    else if (String(address).trim().length > 180) errors.address = "La dirección no puede superar los 180 caracteres.";
  }
  return errors;
}
