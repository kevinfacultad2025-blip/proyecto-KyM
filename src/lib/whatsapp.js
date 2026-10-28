import { BUSINESS } from "../data/business.js";
import { formatName, itemPrice, itemUnitCount, money } from "./pricing.js";

export function normalizePhone(raw) {
  let digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("549") && digits.length === 13) return digits;
  if (digits.startsWith("54") && digits.length === 12) return `549${digits.slice(2)}`;
  if (digits.startsWith("0")) digits = digits.slice(1);
  // Argentina's old local mobile notation can include 15 after the area code.
  if (digits.length === 12 && digits.slice(3, 5) === "15") digits = digits.slice(0, 3) + digits.slice(5);
  if (digits.startsWith("15")) digits = digits.slice(2);
  if (digits.length === 10) return `549${digits}`;
  if (digits.length === 11 && digits.startsWith("9")) return `54${digits}`;
  return digits;
}

export function buildOrderMessage(order) {
  const lines = [
    `¡Hola! Quiero hacer un pedido en ${BUSINESS.name}.`,
    "",
    "MI PEDIDO",
  ];
  (order.items ?? []).forEach((item, index) => {
    lines.push(`${index + 1}. ${formatName(item.format)} — ${money(itemPrice(item))}`);
    (item.flavors ?? []).filter((f) => f.quantity > 0).forEach((f) => lines.push(`   • ${f.name}: ${f.quantity}`));
  });
  const units = (order.items ?? []).reduce((sum, item) => sum + itemUnitCount(item), 0);
  lines.push("", `Total de empanadas: ${units}`, `Subtotal de productos: ${money(order.subtotal ?? 0)}`, "");
  lines.push(`Entrega: ${order.mode === "delivery" ? "Envío a domicilio" : "Retiro por el local"}`);
  if (order.mode === "delivery") {
    lines.push(`Apellido: ${order.surname}`, `Dirección exacta: ${order.address}`);
    lines.push("Envío: a confirmar por WhatsApp");
  } else {
    if (order.pickupName?.trim()) lines.push(`Nombre para retirar: ${order.pickupName.trim()}`);
    lines.push(`Retiro en: ${BUSINESS.pickupAddress}`);
  }
  lines.push(`Pago: ${order.payment === "transfer" ? "Transferencia" : "Efectivo"}`);
  if (order.payment === "transfer") lines.push("Por favor, envíenme los datos para transferir.");
  if (order.notes?.trim()) lines.push(`Nota: ${order.notes.trim()}`);
  lines.push("", "¿Me confirman disponibilidad, por favor?");
  if (order.mode === "delivery") lines.push("También quisiera confirmar si llegan a mi dirección y cuánto cuesta el envío.");
  return lines.join("\n");
}
export function buildWaLink(phone, message) {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(message)}`;
}
