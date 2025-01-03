class Confetti extends HTMLElement {
    static random(min, max) {
        return min + Math.floor(Math.random() * (max - min) + 1);
    }

    static attrs = {
        count: "count",
        mode: "mode",
        text: "text"
    }

    #registerCSSProperties() {
        if (!window.CSS?.registerProperty) return false;
        
        const properties = [
            { name: '--confetti-fall-spinAngle', syntax: '<angle>', initialValue: '0deg' },
            { name: '--confetti-fall-x', syntax: '<length>', initialValue: '0px' },
            { name: '--confetti-fall-y', syntax: '<length>', initialValue: '0px' },
            { name: '--confetti-fall-fill', syntax: '<color>', initialValue: '#123' }
        ];

        properties.forEach(prop => {
            try {
                CSS.registerProperty({
                    ...prop,
                    inherits: prop.name === '--confetti-fall-fill'
                });
            } catch (e) {
                console.warn(`Failed to register ${prop.name}:`, e);
            }
        });
        return true;
    }

    connectedCallback() {
        if (!this.#registerCSSProperties()) return;

        const count = parseInt(this.getAttribute(Confetti.attrs.count)) || 100;
        const mode = this.#determineMode();
        const shadowRoot = this.attachShadow({ mode: "open" });
        
        shadowRoot.appendChild(this.#createStyles());
        this.#createConfetti(count, shadowRoot);
        shadowRoot.appendChild(document.createElement("slot"));
    }

    #determineMode() {
        if (this.hasAttribute(Confetti.attrs.mode)) {
            return this.getAttribute(Confetti.attrs.mode);
        }
        const mode = this.firstElementChild ? "element" : "page";
        this.setAttribute(Confetti.attrs.mode, mode);
        return mode;
    }

    #createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :host {
                --confetti-fall-size: 10px;
                --confetti-fall-fill: var(--confetti-fall-color, #f69);
                --confetti-fall-fill-2: oklch(from var(--confetti-fall-fill) calc(l * 0.75) c h);
            }
            
            :host([mode="element"]) {
                display: block;
                position: relative;
                overflow: hidden;
            }
            
            :host([mode="page"]) {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
            }
            
            :host([mode="page"]),
            :host([mode="element"]) > * {
                pointer-events: none;
            }

            :host([mode="element"]) ::slotted(*) {
                pointer-events: all;
            }
            
            :host([text]) * {
                font-size: var(--confetti-fall-size);
				--confetti-fall-fill: transparent!important;;
				--confetti-fall-fil-2: transparent!important;
            }
            
            @keyframes spin {
                to { --confetti-fall-spinAngle: 360deg; }
            }
            
            @keyframes fall {
                from { --confetti-fall-y: -100px; }
                to { --confetti-fall-y: 1000px; }
            }
            
            @keyframes drift {
                to { --confetti-fall-x: 10vmin; }
            }
            
            @keyframes colorshift {
                from { --confetti-fall-fill: var(--confetti-fall-fill); }
                to { --confetti-fall-fill: var(--confetti-fall-fill-2); }
            }
            
            .confetti {
                --confetti-fall-y: -10px;
                --confetti-fall-x: -10px;
                --confetti-fall-tilt: 0;
                --confetti-fall-tilt-2: 0;
                --confetti-fall-spinAngle: 0deg;
                --confetti-fall-animation-delay: -1s;

                position: absolute;
                pointer-events: none;
                width: var(--confetti-fall-size);
                height: var(--confetti-fall-size);
                border-radius: 50%;
                background: var(--confetti-fall-fill);
                animation: 
                    fall 7.33s linear infinite var(--confetti-fall-animation-delay),
                    spin 1s linear infinite var(--confetti-fall-animation-delay),
                    drift 3s ease-in-out infinite alternate var(--confetti-fall-animation-delay),
                    colorshift 0.5s ease-in-out infinite alternate var(--confetti-fall-animation-delay);
                transform: 
                    translate(var(--confetti-fall-x), var(--confetti-fall-y))
                    rotate3d(var(--confetti-fall-tilt), var(--confetti-fall-tilt-2), 0, var(--confetti-fall-spinAngle));
                transform-origin: 10% 60%;
            }`;
        return style;
    }

    #createConfetti(count, shadowRoot) {
        const template = document.createElement("div");
        template.classList.add("confetti");
        template.innerText = this.getAttribute(Confetti.attrs.text) || "";

        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < count; i++) {
            const confetti = template.cloneNode(true);
            confetti.style.setProperty('--confetti-fall-animation-delay', `-${Math.random() * 20}s`);
            confetti.style.setProperty('--confetti-fall-tilt', Math.random().toString());
            confetti.style.setProperty('--confetti-fall-tilt-2', Math.random().toString());
            confetti.style.setProperty('left', `${Math.random() * 100}%`);
            fragment.appendChild(confetti);
        }

        shadowRoot.appendChild(fragment);
    }
}

customElements.define("confetti-fall", Confetti);