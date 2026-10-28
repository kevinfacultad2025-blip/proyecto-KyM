import test from "node:test";
import assert from "node:assert/strict";
import { BUSINESS } from "../data/business.js";
import { FORMATS, cartSubtotal, itemPrice, isItemComplete, promoSavings } from "./pricing.js";
import { buildOrderMessage, buildWaLink, normalizePhone } from "./whatsapp.js";
import { validateCheckout } from "./validation.js";
import { readCart, writeCart, clearSavedData } from "./cartStorage.js";

const flavors = (pollo, carne, mondongo) => [
  { id: "pollo", name: "Pollo", quantity: pollo },
  { id: "carne", name: "Carne", quantity: carne },
  { id: "mondongo", name: "Mondongo", quantity: mondongo },
];
const item = (format, units, counts) => ({ id: "x", format, units, flavors: flavors(...counts) });

test("precio por unidad: una empanada cuesta $1.000", () => assert.equal(itemPrice(item("unit", 1, [1,0,0])), 1000));
test("media docena cuesta $5.500 aunque se mezclen sabores", () => assert.equal(itemPrice(item("halfDozen", 6, [3,2,1])), 5500));
test("docena cuesta $11.000 con sabores combinados", () => assert.equal(itemPrice(item("dozen", 12, [4,4,4])), 11000));
test("dos docenas cuestan $20.000", () => assert.equal(itemPrice(item("twoDozen", 24, [8,8,8])), 20000));
test("la promo ahorra $2.000 frente a dos docenas regulares", () => assert.equal(promoSavings(), 2000));
test("los formatos especiales no multiplican el precio por cantidad", () => assert.equal(itemPrice(item("halfDozen", 6, [2,2,2])), 5500));
test("subtotal suma correctamente diferentes líneas", () => assert.equal(cartSubtotal([item("unit", 2, [1,1,0]), item("halfDozen", 6, [3,2,1])]), 7500));
test("formato de unidad rechaza cantidades inválidas para cálculo", () => assert.equal(itemPrice(item("unit", 0, [0,0,0])), 0));
test("composición completa valida la suma de sabores", () => assert.equal(isItemComplete(item("halfDozen", 6, [3,2,1])), true));
test("composición incompleta no se considera completa", () => assert.equal(isItemComplete(item("halfDozen", 6, [2,2,1])), false));
test("el carrito vacío suma cero", () => assert.equal(cartSubtotal([]), 0));
test("normaliza un número argentino local a formato WhatsApp", () => assert.equal(normalizePhone("381 252-0142"), "5493812520142"));
test("normaliza prefijo internacional 54 sin duplicarlo", () => assert.equal(normalizePhone("54 381 252 0142"), "5493812520142"));
test("no duplica prefijo 549 existente", () => assert.equal(normalizePhone("+54 9 381 252 0142"), "5493812520142"));
test("acepta notación local con cero y 15", () => assert.equal(normalizePhone("0381 15 2520142"), "5493812520142"));
test("el enlace de WhatsApp codifica caracteres y saltos de línea", () => {
  const url = buildWaLink("3812520142", "Hola & buen día\n¿Hay pollo?");
  assert.ok(url.startsWith("https://wa.me/5493812520142?text="));
  assert.ok(url.includes(encodeURIComponent("Hola & buen día\n¿Hay pollo?")));
});
test("mensaje de pedido incluye productos, sabores, total y retiro", () => {
  const message = buildOrderMessage({ items: [item("halfDozen", 6, [3,2,1])], subtotal: 5500, mode: "pickup", payment: "cash" });
  assert.match(message, /K&M Empanadas/);
  assert.match(message, /Media docena/);
  assert.match(message, /Pollo: 3/);
  assert.match(message, /Saavedra 1426/);
  assert.match(message, /Efectivo/);
});
test("mensaje de envío incluye apellido y dirección y no inventa tarifa", () => {
  const message = buildOrderMessage({ items: [item("unit", 1, [1,0,0])], subtotal: 1000, mode: "delivery", surname: "Pérez", address: "Calle #123", payment: "transfer" });
  assert.match(message, /Apellido: Pérez/);
  assert.match(message, /Dirección exacta: Calle #123/);
  assert.match(message, /cuánto cuesta el envío/);
  assert.doesNotMatch(message, /Envío: \$\d/);
  assert.match(message, /datos para transferir/);
});
test("entrega bloquea apellido y dirección vacíos", () => assert.deepEqual(validateCheckout({ mode: "delivery", surname: "", address: " " }), { surname: "Ingresá tu apellido.", address: "Ingresá la dirección exacta de entrega." }));
test("retiro no exige domicilio particular", () => assert.deepEqual(validateCheckout({ mode: "pickup", surname: "", address: "" }), {}));
test("catálogo tiene exactamente tres sabores y cuatro formatos", () => {
  assert.deepEqual(BUSINESS.flavors.map((f) => f.id), ["pollo", "carne", "mondongo"]);
  assert.equal(FORMATS.length, 4);
});


test("el carrito persiste en localStorage y recupera los artículos válidos", () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  const cart = [item("halfDozen", 6, [3,2,1])];
  writeCart(cart);
  assert.equal(readCart().length, 1);
  assert.equal(readCart()[0].flavors.reduce((sum, f) => sum + f.quantity, 0), 6);
  clearSavedData();
  delete globalThis.localStorage;
});
test("localStorage corrupto se descarta de forma segura", () => {
  const store = new Map([["km-cart-v1", "{esto no es json"]]);
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  assert.deepEqual(readCart(), []);
  delete globalThis.localStorage;
});
test("un formato guardado con cantidades inconsistentes se descarta", () => {
  const store = new Map([["km-cart-v1", JSON.stringify({ version: 1, items: [item("halfDozen", 6, [1,1,1])] })]]);
  globalThis.localStorage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
  assert.deepEqual(readCart(), []);
  delete globalThis.localStorage;
});
