/**
 * @attr {number} count - amount of generated confettis
 * @attr {string} mode - either "page" or "element"
 * @attr {string} text - optional text as confetti glyphs
 * @cssprop --confetti-fall-color - color of the confettis
 * @cssprop --confetti-fall-size - size of the generated confettis
 * @summary adds animated confetti effects to your website or specific elements
 * @tagname confetti-fall
 * 
 */

export class Confetti extends HTMLElement {
  static observedAttributes = ["count", "mode", "text"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  registerCSSProperties() {
    if (!window.CSS?.registerProperty) return false;
    const properties = [
      { name: "--confetti-fall-spinAngle", syntax: "<angle>", initialValue: "0deg" },
      { name: "--confetti-fall-x",         syntax: "<length>", initialValue: "0px"  },
      { name: "--confetti-fall-y",         syntax: "<length>", initialValue: "0px"  },
      { name: "--confetti-fall-fill",      syntax: "<color>",  initialValue: "#123" },
    ];
    properties.forEach((prop) => {
      try {
        CSS.registerProperty({ ...prop, inherits: prop.name === "--confetti-fall-fill" });
      } catch {}
    });
    return true;
  }

  connectedCallback() {
    this.registerCSSProperties();
    this.determineMode();

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        --confetti-fall-size: 10px;
        --confetti-fall-fill: var(--confetti-fall-color, #f69);
        --confetti-fall-fill-2: oklch(from var(--confetti-fall-fill) calc(l * 0.75) c h);
        display: block;
        position: relative;
        contain: content;
      }

      :host([mode="element"]) {
        display: block;
        position: relative;
        overflow: hidden;
      }

      :host([mode="page"]) {
        position: fixed;
        inset: 0;
        height: 100vh;
        pointer-events: none;
      }

      :host([mode="page"]) > * { pointer-events: none; }
      :host([mode="element"]) ::slotted(*) { pointer-events: all; }

      :host([text]) * {
        font-size: var(--confetti-fall-size);
        --confetti-fall-fill: transparent !important;
        --confetti-fall-fill-2: transparent !important;
      }

      @keyframes spin   { to { --confetti-fall-spinAngle: 360deg; } }
      @keyframes fall   { from { --confetti-fall-y: -100px; } to { --confetti-fall-y: 100vh; } }
      @keyframes drift  { to { --confetti-fall-x: 10vmin; } }
      @keyframes colorshift {
        from { --confetti-fall-fill: var(--confetti-fall-fill); }
        to   { --confetti-fall-fill: var(--confetti-fall-fill-2); }
      }

      .confetti {
        --confetti-fall-y: -10px;
        --confetti-fall-x: -10px;
        --confetti-fall-tilt: 0;
        --confetti-fall-tilt-2: 0;
        --confetti-fall-spinAngle: 0deg;
        --confetti-fall-animation-delay: -1s;

        position: absolute;
        top:0;
        width: var(--confetti-fall-size);
        height: var(--confetti-fall-size);
        border-radius: 50%;
        background: var(--confetti-fall-fill);
        will-change: transform;
        transform:
          translate(var(--confetti-fall-x), var(--confetti-fall-y))
          rotate3d(var(--confetti-fall-tilt), var(--confetti-fall-tilt-2), 0, var(--confetti-fall-spinAngle));
        transform-origin: 10% 60%;
        animation:
          fall 7.33s linear infinite var(--confetti-fall-animation-delay),
          spin 1s linear infinite var(--confetti-fall-animation-delay),
          drift 3s ease-in-out infinite alternate var(--confetti-fall-animation-delay),
          colorshift 0.5s ease-in-out infinite alternate var(--confetti-fall-animation-delay);
        pointer-events: none;
      }
    `);
    this.shadowRoot.adoptedStyleSheets = [sheet];

    if (!this.shadowRoot.querySelector("slot")) {
      this.shadowRoot.appendChild(document.createElement("slot"));
    }
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "count" || name === "text") {
      this.render();
    }
  }

  determineMode() {
    if (this.hasAttribute("mode")) return this.getAttribute("mode");
    const mode = this.firstElementChild ? "element" : "page";
    this.setAttribute("mode", mode);
    return mode;
  }

  get count() {
    const v = Number(this.getAttribute("count"));
    return Number.isFinite(v) && v >= 0 ? v : 80;
  }

  set count(v) { this.setAttribute("count", String(v)); }

  get text() { return this.getAttribute("text") || ""; }
  set text(v) { this.setAttribute("text", v); }

  render() {
    this.shadowRoot.querySelectorAll(".confetti").forEach((n) => n.remove());

    const template = document.createElement("div");
    template.classList.add("confetti");
    template.textContent = this.text;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < this.count; i++) {
      const confetti = template.cloneNode(true);
      confetti.style.setProperty("--confetti-fall-animation-delay", `-${Math.random() * 20}s`);
      confetti.style.setProperty("--confetti-fall-tilt", Math.random().toString());
      confetti.style.setProperty("--confetti-fall-tilt-2", Math.random().toString());
      confetti.style.left = `${Math.random() * 100}%`;
      fragment.appendChild(confetti);
    }

    this.shadowRoot.appendChild(fragment);
  }
}
