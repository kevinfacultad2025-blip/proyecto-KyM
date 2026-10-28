import { BUSINESS } from "../data/business.js";
import { FORMATS } from "./pricing.js";

const CART_KEY = "km-cart-v1";
const CHECKOUT_KEY = "km-checkout-v1";
const VERSION = 1;

export function readCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) ?? "null");
    if (!parsed || parsed.version !== VERSION || !Array.isArray(parsed.items)) return [];
    return parsed.items.filter((item) => {
      const format = FORMATS.find((f) => f.id === item.format);
      const validFlavors = Array.isArray(item.flavors) &&
        item.flavors.length === BUSINESS.flavors.length &&
        item.flavors.every((f) => BUSINESS.flavors.some((known) => known.id === f.id) &&
          Number.isInteger(f.quantity) && f.quantity >= 0 && f.quantity <= 99);
      const unitsValid = format?.type === "loose"
        ? Number.isInteger(item.units) && item.units >= 1 && item.units <= 99
        : item.units === format?.units;
      const total = validFlavors ? item.flavors.reduce((sum, f) => sum + f.quantity, 0) : -1;
      return Boolean(format && validFlavors && unitsValid && total === item.units);
    }).map((item) => ({
      ...item,
      flavors: BUSINESS.flavors.map((f) => ({
        id: f.id, name: f.name,
        quantity: item.flavors.find((x) => x.id === f.id)?.quantity ?? 0,
      })),
    }));
  } catch { return []; }
}
export function writeCart(items) {
  try { localStorage.setItem(CART_KEY, JSON.stringify({ version: VERSION, items })); } catch { /* storage can be unavailable */ }
}
export function readCheckout() {
  try {
    const data = JSON.parse(localStorage.getItem(CHECKOUT_KEY) ?? "null");
    return data?.version === VERSION ? data.values : null;
  } catch { return null; }
}
export function writeCheckout(values) {
  try { localStorage.setItem(CHECKOUT_KEY, JSON.stringify({ version: VERSION, values })); } catch { /* storage can be unavailable */ }
}
export function clearSavedData() {
  try { localStorage.removeItem(CART_KEY); localStorage.removeItem(CHECKOUT_KEY); } catch { /* storage can be unavailable */ }
}
