import { BUSINESS } from "../data/business.js";

export const FORMATS = [
  { id: "unit", label: "Por unidad", units: 1, price: BUSINESS.prices.unit, type: "loose" },
  { id: "halfDozen", label: "Media docena", units: 6, price: BUSINESS.prices.halfDozen, type: "pack" },
  { id: "dozen", label: "Docena", units: 12, price: BUSINESS.prices.dozen, type: "pack" },
  { id: "twoDozen", label: "2 docenas", units: 24, price: BUSINESS.prices.twoDozen, type: "pack" },
];

export const money = (value) => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0,
}).format(Number(value) || 0);

export function itemUnits(item) {
  if (!item || !Number.isInteger(item.units) || item.units < 1 || item.units > 99) return 0;
  return item.units;
}
export function itemPrice(item) {
  if (!item) return 0;
  const format = FORMATS.find((f) => f.id === item.format);
  if (!format) return 0;
  if (format.type === "loose") return itemUnits(item) * BUSINESS.prices.unit;
  return format.price;
}
export function cartSubtotal(cart = []) {
  return cart.reduce((sum, item) => sum + itemPrice(item), 0);
}
export function isItemComplete(item) {
  const format = FORMATS.find((f) => f.id === item?.format);
  if (!format || !Array.isArray(item.flavors)) return false;
  const counts = item.flavors.reduce((sum, f) => sum + (Number.isInteger(f.quantity) && f.quantity >= 0 ? f.quantity : 0), 0);
  return counts === itemUnits({ ...item, units: format.units }) && counts > 0 &&
    item.flavors.every((f) => Number.isInteger(f.quantity) && f.quantity >= 0 && f.quantity <= 99);
}
export function promoSavings() {
  return BUSINESS.prices.dozen * 2 - BUSINESS.prices.twoDozen;
}
export function formatName(id) {
  return FORMATS.find((f) => f.id === id)?.label ?? "Formato";
}
export function itemUnitCount(item) {
  return item?.format === "unit" ? item.units : (FORMATS.find((f) => f.id === item?.format)?.units ?? 0);
}
