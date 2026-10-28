import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Rutas from "./routes/Rutas.jsx";
import { BUSINESS } from "./data/business.js";
import { FORMATS, cartSubtotal, formatName, itemPrice, itemUnitCount, money, promoSavings } from "./lib/pricing.js";
import { buildOrderMessage, buildWaLink } from "./lib/whatsapp.js";
import { validateCheckout } from "./lib/validation.js";
import { clearSavedData, readCart, readCheckout, writeCart, writeCheckout } from "./lib/cartStorage.js";

const freshFlavors = () => BUSINESS.flavors.map((f) => ({ id: f.id, name: f.name, quantity: 0 }));
const blankItem = (format = "halfDozen", units = 6) => ({ id: "", format, units, flavors: freshFlavors() });
const clamp = (value) => Number.isInteger(value) ? Math.max(0, Math.min(99, value)) : 0;

function EmpanadaIllustration() {
  return <svg className="hero-art" viewBox="0 0 440 360" role="img" aria-label="Ilustración decorativa de empanadas, no es una fotografía real" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="220" cy="296" rx="174" ry="28" fill="#e8b4c6" opacity=".45"/>
    <g transform="rotate(-13 190 180)">
      <path d="M65 205 Q84 87 200 70 Q305 60 341 177 Q270 235 162 244 Q100 242 65 205Z" fill="#d98645" stroke="#a95d31" strokeWidth="5"/>
      <path d="M76 199 Q100 116 200 88 Q282 82 324 172 Q252 220 163 228 Q105 225 76 199Z" fill="#f4c27d"/>
      <path d="M91 192 Q112 123 202 102 Q277 97 307 169 Q245 209 164 216 Q115 214 91 192Z" fill="#e6a45d"/>
      {Array.from({length: 13}, (_, i) => <path key={i} d={`M${91+i*17} ${195-Math.sin(i/12*Math.PI)*65} q9 11 17 0`} fill="none" stroke="#b86d39" strokeWidth="5" strokeLinecap="round"/>)}
      <path d="M112 148 Q190 99 267 128" fill="none" stroke="#ffe0a3" strokeWidth="5" strokeLinecap="round" opacity=".75"/>
    </g>
    <g transform="translate(235 130) rotate(20)">
      <path d="M0 125 Q9 24 97 0 Q171 -7 193 89 Q140 146 74 154 Q26 154 0 125Z" fill="#d98645" stroke="#a95d31" strokeWidth="4"/>
      <path d="M12 120 Q25 43 98 18 Q157 14 178 86 Q128 128 75 138 Q34 138 12 120Z" fill="#f6c783"/>
      {Array.from({length: 8}, (_, i) => <path key={i} d={`M${25+i*19} ${116-Math.sin(i/7*Math.PI)*68} q7 9 13 0`} fill="none" stroke="#b86d39" strokeWidth="4" strokeLinecap="round"/>)}
    </g>
    <circle cx="87" cy="83" r="7" fill="#c95079"/><circle cx="345" cy="65" r="10" fill="#e9b45d"/><path d="M344 98 l9 13 15-2" fill="none" stroke="#c95079" strokeWidth="4" strokeLinecap="round"/>
  </svg>;
}

function Header({ count }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["Menú", "/menu"],
    ["Precios", "/precios"],
    ["Cómo comprar", "/como-comprar"],
    ["Preguntas", "/preguntas"],
    ["Contacto", "/contacto"],
  ];
  return <header className="site-header">
    <Link className="brand" to="/" aria-label="K&M Empanadas, inicio" onClick={() => setOpen(false)}><span className="brand-mark">K<span>&</span>M</span><span className="brand-copy">EMPANADAS<small>Hechas con amor</small></span></Link>
    <button className="menu-toggle" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><span></span><span></span><span></span></button>
    <nav id="main-nav" className={open ? "main-nav is-open" : "main-nav"} aria-label="Navegación principal">
      {links.map(([label, to]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>{label}</NavLink>)}
      <NavLink className="nav-cta" to="/mi-pedido" onClick={() => setOpen(false)}>Armar pedido <span aria-hidden="true">↗</span>{count > 0 && <span className="nav-count">{count}</span>}</NavLink>
    </nav>
  </header>;
}

function FlavorIcon({ id }) {
  return <span className={`flavor-icon ${id}`} aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M7 39Q11 12 32 8Q53 12 57 39Q43 56 32 56Q18 55 7 39Z" fill="currentColor" opacity=".9"/><path d="M12 38Q17 17 32 14Q48 17 52 38Q42 49 32 50Q20 49 12 38Z" fill="#fff0d8"/><path d="M14 36l7 5 4-8 7 7 6-9 7 7 6-5" fill="none" stroke="#c77843" strokeWidth="3" strokeLinecap="round"/><path d="M17 28l3-4m8-3 2-3m10 5 3-3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg></span>;
}

function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => readCart());
  const [builder, setBuilder] = useState(() => blankItem());
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [checkout, setCheckout] = useState(() => ({ mode: "pickup", payment: "cash", surname: "", address: "", pickupName: "", notes: "", ...(readCheckout() ?? {}) }));
  const [fallback, setFallback] = useState("");
  const surnameRef = useRef(null);
  const addressRef = useRef(null);
  const subtotal = useMemo(() => cartSubtotal(cart), [cart]);
  const itemCount = cart.reduce((sum, item) => sum + itemUnitCount(item), 0);
  const builderFormat = FORMATS.find((f) => f.id === builder.format) ?? FORMATS[1];
  const builderTarget = builder.format === "unit" ? clamp(builder.units) : builderFormat.units;
  const builderCount = builder.flavors.reduce((sum, f) => sum + f.quantity, 0);
  const remaining = builderTarget - builderCount;

  useEffect(() => { writeCart(cart); }, [cart]);
  useEffect(() => { writeCheckout(checkout); }, [checkout]);

  function goToBuilder() {
    navigate("/menu");
    window.setTimeout(() => document.querySelector(".builder-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 180);
  }

  function chooseFormat(formatId) {
    const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[1];
    setBuilder((old) => {
      const target = format.type === "loose" ? Math.max(1, Math.min(99, old.format === "unit" ? old.units : 1)) : format.units;
      let flavors = old.flavors.map((f) => ({ ...f }));
      let excess = flavors.reduce((s, f) => s + f.quantity, 0) - target;
      for (let i = flavors.length - 1; i >= 0 && excess > 0; i--) {
        const remove = Math.min(flavors[i].quantity, excess);
        flavors[i].quantity -= remove; excess -= remove;
      }
      return { ...old, format: formatId, units: target, flavors };
    });
  }
  function setFlavorQuantity(id, next) {
    setBuilder((old) => {
      const format = FORMATS.find((f) => f.id === old.format);
      const target = format.type === "loose" ? old.units : format.units;
      const current = old.flavors.reduce((sum, f) => sum + f.quantity, 0);
      const flavor = old.flavors.find((f) => f.id === id);
      const quantity = clamp(next);
      if (!flavor || (quantity > flavor.quantity && current - flavor.quantity + quantity > target)) return old;
      const flavors = old.flavors.map((f) => f.id === id ? { ...f, quantity } : f);
      return { ...old, flavors };
    });
  }
  function changeLooseUnits(value) {
    if (value === "" || !/^\d+$/.test(value)) {
      setBuilder((old) => ({ ...old, units: value === "" ? 0 : old.units }));
      return;
    }
    const units = Math.max(1, Math.min(99, Number(value)));
    setBuilder((old) => {
      let flavors = old.flavors.map((f) => ({ ...f }));
      let excess = flavors.reduce((s, f) => s + f.quantity, 0) - units;
      for (let i = flavors.length - 1; i >= 0 && excess > 0; i--) { const n = Math.min(excess, flavors[i].quantity); flavors[i].quantity -= n; excess -= n; }
      return { ...old, units, flavors };
    });
  }
  function resetBuilder() { setBuilder(blankItem()); setEditingId(null); }
  function addOrSaveItem() {
    if (builderCount !== builderTarget || builderTarget < 1) { setNotice(`Te ${remaining > 0 ? `faltan ${remaining}` : `sobran ${Math.abs(remaining)}`} empanada(s) para completar el formato.`); return; }
    const item = { ...builder, id: editingId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, units: builderTarget, flavors: builder.flavors.map((f) => ({ ...f })) };
    setCart((old) => editingId ? old.map((x) => x.id === editingId ? item : x) : [...old, item]);
    setNotice(editingId ? "Pedido actualizado." : "¡Agregado a tu pedido!");
    resetBuilder();
  }
  function editItem(item) {
    setBuilder({ ...item, flavors: BUSINESS.flavors.map((f) => ({ ...f, quantity: item.flavors.find((x) => x.id === f.id)?.quantity ?? 0 })) });
    setEditingId(item.id);
    setNotice("Editando este producto. Guardá los cambios para actualizarlo.");
    goToBuilder();
  }
  function removeItem(id) { setCart((old) => old.filter((x) => x.id !== id)); }
  function duplicateItem(item) { setCart((old) => [...old, { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, flavors: item.flavors.map((f) => ({ ...f })) }]); setNotice("Producto duplicado."); }
  function updateCheckout(key, value) { setCheckout((old) => ({ ...old, [key]: value })); }
  function startWhatsApp(phone) {
    setFallback("");
    if (!cart.length) { setNotice("Primero agregá productos a tu pedido."); navigate("/menu"); return; }
    const errors = validateCheckout(checkout);
    if (Object.keys(errors).length) {
      setNotice(Object.values(errors)[0]);
      const first = errors.surname ? surnameRef : addressRef;
      first.current?.focus();
      return;
    }
    const message = buildOrderMessage({ items: cart, subtotal, ...checkout });
    const url = buildWaLink(phone, message);
    const popup = window.open(url, "_blank");
    if (popup) popup.opener = null;
    else setFallback(message);
    setNotice("WhatsApp abre el mensaje preparado; todavía tenés que enviarlo y esperar la confirmación del negocio.");
  }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(fallback); setNotice("Mensaje copiado. Pegalo en el chat de WhatsApp."); }
    catch { setNotice("No se pudo copiar automáticamente. Seleccioná y copiá el texto del mensaje."); }
  }
  function clearAllSaved() {
    clearSavedData(); setCart([]); setCheckout({ mode: "pickup", payment: "cash", surname: "", address: "", pickupName: "", notes: "" }); setFallback(""); setShowClearConfirm(false); setNotice("Se borraron el pedido y los datos guardados en este navegador.");
  }

  return <div className="app-shell">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header count={itemCount} />
    <main id="contenido">
      <Rutas
        homePage={<>      <section id="inicio" className="hero-section section-wrap">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot"></span> HECHAS PARA COMPARTIR</span>
          <h1>Un gustito casero,<br /><em>en cada empanada.</em></h1>
          <p className="hero-slogan">{BUSINESS.slogan}.</p>
          <p className="hero-description">Elegí tus sabores favoritos, armá tu pedido a tu manera y coordiná por WhatsApp.</p>
          <div className="hero-actions"><Link className="button button-primary" to="/menu">Armar mi pedido <span aria-hidden="true">↗</span></Link><Link className="text-link" to="/precios">Ver precios <span aria-hidden="true">↓</span></Link></div>
          <div className="hero-trust"><span>♡</span> Listas para hornear <i></i> Sin mínimo de compra</div>
        </div>
        <div className="hero-visual"><div className="art-backdrop"></div><EmpanadaIllustration /><span className="art-note note-one">Hechas con amor</span><span className="art-note note-two">¡Elegí tus sabores!</span><div className="hero-sticker">CASERITAS<br /><b>& riquísimas</b></div></div>
      </section></>}
        menuPage={<>      <section id="menu" className="section-wrap menu-section">
        <div className="section-heading"><div><span className="eyebrow">NUESTROS SABORES</span><h2>¿Cuál se te antoja?</h2></div><p>Empanadas listas para hornear.<br />Combiná como más te guste.</p></div>
        <div className="flavor-grid">{BUSINESS.flavors.map((flavor) => <article className="flavor-card" key={flavor.id}><FlavorIcon id={flavor.id} /><span className="card-kicker">EL CLÁSICO</span><h3>{flavor.name}</h3><p>{flavor.description}</p><span className="flavor-price">Desde {money(BUSINESS.prices.unit)} <small>/ unidad</small></span></article>)}</div>
      </section>      <section className="section-wrap builder-section">
        <div className="section-heading"><div><span className="eyebrow">A TU MANERA</span><h2>Armá tu combinación.</h2></div><p>Repartí las empanadas entre<br />tus sabores preferidos.</p></div>
        <div className="builder-card">
          <div className="builder-top"><div><span className="step-number">01</span><div><h3>Elegí el formato</h3><p>Los precios se calculan automáticamente.</p></div></div><div className="format-options" role="group" aria-label="Formato del pedido">{FORMATS.map((f) => <button key={f.id} type="button" className={builder.format === f.id ? "format-option selected" : "format-option"} aria-pressed={builder.format === f.id} onClick={() => chooseFormat(f.id)}><b>{f.label}</b><span>{money(f.price)}{f.type === "loose" ? " c/u" : ""}</span></button>)}</div>{builder.format === "unit" && <label className="loose-count">Cantidad de unidades <input type="number" min="1" max="99" step="1" value={builder.units || ""} onChange={(e) => changeLooseUnits(e.target.value)} onBlur={() => { if (!builder.units) changeLooseUnits("1"); }} /></label>}{builder.format === "unit" && [6, 12, 24].includes(builderTarget) && (() => { const recommended = builderTarget === 6 ? "halfDozen" : builderTarget === 12 ? "dozen" : "twoDozen"; const format = FORMATS.find((f) => f.id === recommended); const saving = builderTarget * BUSINESS.prices.unit - format.price; return saving > 0 ? <p className="recommendation">Sugerencia: para {builderTarget} unidades te conviene elegir <b>{format.label.toLowerCase()}</b>: ahorrás {money(saving)}. <button type="button" onClick={() => chooseFormat(recommended)}>Cambiar formato</button></p> : null; })()}</div>
          <div className="builder-flavors"><div className="builder-flavor-heading"><span className="step-number">02</span><div><h3>Repartí los sabores</h3><p>Usá + y − para elegir la cantidad de cada uno.</p></div></div>
            {builder.flavors.map((f) => <div className="stepper-row" key={f.id}><FlavorIcon id={f.id} /><div className="stepper-name"><b>{f.name}</b><small>{f.description}</small></div><div className="stepper-controls"><button type="button" aria-label={`Quitar una empanada de ${f.name}`} disabled={f.quantity <= 0} onClick={() => setFlavorQuantity(f.id, f.quantity - 1)}>−</button><input aria-label={`Cantidad de empanadas de ${f.name}`} type="number" min="0" max="99" step="1" value={f.quantity} onChange={(e) => { const val = e.target.value; if (/^\d{0,2}$/.test(val)) setFlavorQuantity(f.id, val === "" ? 0 : Number(val)); }} /><button type="button" aria-label={`Agregar una empanada de ${f.name}`} disabled={remaining <= 0 || f.quantity >= 99} onClick={() => setFlavorQuantity(f.id, f.quantity + 1)}>+</button></div></div>)}
            <div className={`builder-progress ${remaining === 0 ? "is-complete" : ""}`} aria-live="polite"><div className="progress-track"><span style={{ width: `${builderTarget ? Math.min(100, builderCount / builderTarget * 100) : 0}%` }}></span></div><b>{builderCount} de {builderTarget || "—"} empanadas</b><span>{remaining > 0 ? `Te faltan ${remaining}` : remaining === 0 ? "¡Combinación completa!" : `Sobran ${Math.abs(remaining)}`}</span></div>
            <div className="builder-footer"><div><small>Precio de esta combinación</small><strong>{money(builder.format === "unit" ? builderTarget * BUSINESS.prices.unit : builderFormat.price)}</strong>{builder.format === "unit" && <small>{builderTarget} × {money(BUSINESS.prices.unit)} = {money(builderTarget * BUSINESS.prices.unit)}</small>}</div><div className="builder-buttons">{editingId && <button className="button button-outline" type="button" onClick={resetBuilder}>Cancelar</button>}<button className="button button-primary" type="button" onClick={addOrSaveItem} disabled={builderCount !== builderTarget || builderTarget < 1}>{editingId ? "Guardar cambios" : "Agregar al pedido"} <span aria-hidden="true">+</span></button></div></div>
          </div>
          {notice && <p className="notice" role="status">{notice}</p>}
        </div>
      </section></>}
        pricesPage={      <section id="precios" className="price-section">
        <div className="section-wrap">
          <div className="section-heading"><div><span className="eyebrow">PRECIOS CLAROS</span><h2>Más compartís,<br className="mobile-break" /> más conveniente.</h2></div><p>Elegí el formato que te quede cómodo.<br />Podés mezclar los tres sabores.</p></div>
          <div className="price-layout"><div className="price-list">
            {FORMATS.map((f) => <div className={`price-row ${f.id === "twoDozen" ? "price-row-featured" : ""}`} key={f.id}><span className="price-quantity">{f.units === 1 ? "01" : String(f.units).padStart(2, "0")}</span><div className="price-label"><b>{f.label}</b><small>{f.type === "loose" ? "Sin mínimo de compra" : "Sabores combinables"}</small></div><strong>{money(f.price)}</strong></div>)}
          </div><aside className="promo-card"><span className="promo-label">PROMO PARA COMPARTIR</span><div className="promo-illustration" aria-hidden="true">12 <span>+</span> 12</div><h3>¡Dos docenas<br />para la mesa!</h3><p>Antes <s>{money(BUSINESS.prices.dozen * 2)}</s> · Ahorrás {money(promoSavings())}</p><strong className="promo-price">{money(BUSINESS.prices.twoDozen)}</strong><button className="button button-light" onClick={() => { chooseFormat("twoDozen"); goToBuilder(); }}>Elegir esta promo <span aria-hidden="true">↗</span></button><small>Podés combinar pollo, carne y mondongo.</small></aside></div>
          <p className="price-note"><span aria-hidden="true">♡</span> Todos los formatos permiten combinar sabores. El precio del envío se confirma por WhatsApp.</p>
        </div>
      </section>}
        orderPage={      <section id="pedido" className="order-section">
        <div className="section-wrap">
          <div className="section-heading"><div><span className="eyebrow">TU PEDIDO</span><h2>Ya casi está.</h2></div><p>Revisá tu combinación y<br />coordiná los detalles por WhatsApp.</p></div>
          <div className="order-layout"><div className="cart-panel"><div className="panel-heading"><div><h3>Tu selección</h3><p>{itemCount} {itemCount === 1 ? "empanada" : "empanadas"} en total</p></div><span className="cart-badge">{cart.length}</span></div>
            {!cart.length ? <div className="empty-cart"><span className="empty-cart-icon">♡</span><h4>Tu pedido empieza acá</h4><p>Elegí tus sabores y formatos para verlos en esta lista.</p><Link to="/menu" className="text-link">Ver sabores <span aria-hidden="true">↗</span></Link></div> : <div className="cart-items">{cart.map((item) => <article className="cart-item" key={item.id}><div className="cart-item-top"><div><b>{formatName(item.format)}</b><small>{item.flavors.filter((f) => f.quantity).map((f) => `${f.name} ${f.quantity}`).join(" · ")}</small></div><strong>{money(itemPrice(item))}</strong></div><div className="cart-item-actions"><button type="button" onClick={() => editItem(item)}>Editar</button><button type="button" onClick={() => duplicateItem(item)}>Duplicar</button><button type="button" onClick={() => removeItem(item.id)}>Quitar</button></div></article>)}</div>}
            <div className="cart-total"><span>Subtotal de productos</span><strong>{money(subtotal)}</strong></div><div className="delivery-cost"><span>Envío</span><span>{checkout.mode === "delivery" ? "A confirmar por WhatsApp" : "No aplica"}</span></div>
            {cart.length > 0 && <button type="button" className="clear-cart" onClick={() => setShowClearConfirm(!showClearConfirm)}>{showClearConfirm ? "No, conservar pedido" : "Vaciar pedido"}</button>}
            {showClearConfirm && <div className="confirm-clear" role="alert"><span>¿Querés quitar todos los productos?</span><button type="button" className="button button-danger" onClick={() => { setCart([]); setShowClearConfirm(false); setNotice("El pedido quedó vacío."); }}>Sí, vaciar</button></div>}
          </div>
          <form className="checkout-panel" onSubmit={(e) => e.preventDefault()} noValidate><span className="eyebrow">ÚLTIMO PASO</span><h3>¿Cómo lo recibís?</h3><div className="mode-options" role="group" aria-label="Forma de entrega"><button type="button" className={checkout.mode === "pickup" ? "mode-option selected" : "mode-option"} aria-pressed={checkout.mode === "pickup"} onClick={() => updateCheckout("mode", "pickup")}><span aria-hidden="true">⌂</span><b>Retiro</b><small>Pasás a buscarlo</small></button><button type="button" className={checkout.mode === "delivery" ? "mode-option selected" : "mode-option"} aria-pressed={checkout.mode === "delivery"} onClick={() => updateCheckout("mode", "delivery")}><span aria-hidden="true">↗</span><b>Envío</b><small>A domicilio</small></button></div>
            {checkout.mode === "delivery" ? <div className="form-fields"><label>Apellido <span aria-hidden="true">*</span><input ref={surnameRef} value={checkout.surname} maxLength="80" autoComplete="family-name" aria-describedby="surname-help" aria-invalid={!checkout.surname.trim() && Boolean(notice)} onChange={(e) => updateCheckout("surname", e.target.value)} placeholder="Tu apellido" /><small id="surname-help">Necesitamos identificar tu pedido.</small></label><label>Dirección exacta <span aria-hidden="true">*</span><input ref={addressRef} value={checkout.address} maxLength="180" autoComplete="street-address" aria-describedby="address-help" aria-invalid={!checkout.address.trim() && Boolean(notice)} onChange={(e) => updateCheckout("address", e.target.value)} placeholder="Calle, número, piso/depto" /><small id="address-help">La cobertura y el costo se confirman por WhatsApp.</small></label></div> : <div className="pickup-note"><span aria-hidden="true">⌂</span><div><b>Retiro por el local</b><p>{BUSINESS.pickupAddress}</p><small>Pagás al retirar. Coordiná disponibilidad por WhatsApp.</small></div></div>}
            {checkout.mode === "pickup" && <label className="optional-name">Nombre para el retiro (opcional)<input value={checkout.pickupName} maxLength="80" onChange={(e) => updateCheckout("pickupName", e.target.value)} placeholder="¿A nombre de quién?" /></label>}
            <fieldset className="payment-field"><legend>Medio de pago</legend><label className="radio-option"><input type="radio" name="payment" checked={checkout.payment === "cash"} onChange={() => updateCheckout("payment", "cash")} /> <span><b>Efectivo</b><small>{checkout.mode === "delivery" ? "Antes de despachar el envío" : "Al momento de retirar"}</small></span></label><label className="radio-option"><input type="radio" name="payment" checked={checkout.payment === "transfer"} onChange={() => updateCheckout("payment", "transfer")} /> <span><b>Transferencia</b><small>{checkout.mode === "delivery" ? "Antes de despachar; pedí los datos por WhatsApp" : "Coordinamos los datos por WhatsApp"}</small></span></label></fieldset>
            <label className="notes-label">Nota para el pedido (opcional)<textarea rows="3" maxLength="200" value={checkout.notes} onChange={(e) => updateCheckout("notes", e.target.value)} placeholder="Algún detalle que quieras comentarnos…" /><small>{checkout.notes.length}/200 caracteres</small></label>
            <div className="checkout-summary"><span>Total de productos</span><strong>{money(subtotal)}</strong><small>{checkout.mode === "delivery" ? "El envío se paga aparte; costo a confirmar." : "No incluye envío."}</small></div>
            <p className="checkout-disclaimer">Al tocar un botón se abrirá WhatsApp con el mensaje preparado. El pedido no se envía automáticamente y queda pendiente de confirmación.</p>
            <div className="whatsapp-actions">{BUSINESS.phones.map((phone) => <button key={phone.number} type="button" className="button button-whatsapp" onClick={() => startWhatsApp(phone.number)}><span aria-hidden="true">◉</span> Pedir por {phone.label}</button>)}</div>
            {fallback && <div className="fallback-message"><label htmlFor="fallback-message">Copiá el mensaje para enviarlo por WhatsApp</label><textarea id="fallback-message" rows="8" value={fallback} readOnly /><button className="button button-outline" type="button" onClick={copyMessage}>Copiar mensaje</button></div>}
            <button type="button" className="clear-data" onClick={clearAllSaved}>Borrar pedido y datos guardados en este dispositivo</button>
          </form></div>
        </div>
      </section>}
        howPage={      <section id="como-comprar" className="section-wrap how-section"><div className="section-heading"><div><span className="eyebrow">SENCILLO Y RICO</span><h2>¿Cómo comprar?</h2></div><p>En pocos pasos, tu pedido<br />queda listo para coordinar.</p></div><div className="how-grid">{[["01","Elegí tus sabores","Combiná pollo, carne y mondongo en el formato que prefieras."],["02","Armá el pedido","Revisá las cantidades y el total de los productos."],["03","Coordiná por WhatsApp","Consultá disponibilidad, entrega y los detalles de pago." ]].map(([n,title,body]) => <article className="how-card" key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>}
        faqPage={      <section id="preguntas" className="faq-section"><div className="section-wrap faq-layout"><div><span className="eyebrow">PREGUNTAS FRECUENTES</span><h2>Todo claro<br />antes de pedir.</h2><p>Si te queda alguna duda, escribinos y lo vemos.</p><Link className="text-link" to="/contacto">Contactanos <span aria-hidden="true">↗</span></Link></div><div className="faq-list">{[
        ["¿Con cuánta anticipación conviene pedir?","Te recomendamos consultar con aproximadamente una hora de anticipación para coordinar disponibilidad."],
        ["¿Qué días trabajan?","Los días habituales son jueves, viernes, sábado y domingo. Consultá por WhatsApp la disponibilidad para tu fecha."],
        ["¿Hacen envíos?","La entrega se coordina dentro de las 4 avenidas. El alcance exacto y el costo del envío se confirman por WhatsApp."],
        ["¿Hay compra mínima?","No, podés pedir desde una sola empanada."],
        ["¿Puedo combinar sabores?","¡Sí! Podés combinar pollo, carne y mondongo en media docena, docena y promo de dos docenas."],
        ["¿Cómo se paga?","Aceptamos efectivo y transferencia. Para envíos, el pago se realiza antes de despachar; para retiro, al momento de retirar. Los detalles de transferencia se coordinan por WhatsApp."],
      ].map(([q,a]) => <details className="faq-item" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</div></div></section>}
        contactPage={      <section id="contacto" className="contact-section"><div className="section-wrap contact-card"><div><span className="eyebrow">¿SE TE ANTOJARON?</span><h2>Lo rico se comparte.</h2><p>Escribinos para consultar disponibilidad, coordinar tu pedido y resolver cualquier duda.</p></div><div className="contact-details"><div><span>RETIRO</span><b>{BUSINESS.pickupAddress}</b></div><div><span>DÍAS HABITUALES</span><b>Jue · Vie · Sáb · Dom</b></div><div className="contact-phone-list">{BUSINESS.phones.map((p) => <a key={p.number} href={buildWaLink(p.number, `¡Hola! Quería consultar por las empanadas de ${BUSINESS.name}.`)} target="_blank" rel="noreferrer">{p.label} <span aria-hidden="true">↗</span></a>)}</div></div></div></section>}
      />
    </main>
    <footer className="site-footer"><Link className="brand footer-brand" to="/"><span className="brand-mark">K<span>&</span>M</span><span className="brand-copy">EMPANADAS<small>Hechas con amor, rellenas de sabor</small></span></Link><p>Empanadas listas para hornear, hechas para compartir.</p><Link to="/" className="back-top">Volver al inicio ↑</Link><small className="copyright">© {new Date().getFullYear()} K&M Empanadas · Los pedidos se confirman por WhatsApp.</small></footer>
    <div className="mobile-order-bar"><div><small>Tu pedido · {itemCount} empanadas</small><b>{money(subtotal)}</b></div><Link to="/mi-pedido" className="button button-primary">Ver pedido <span aria-hidden="true">↗</span></Link></div>
  </div>;
}
export default App;
