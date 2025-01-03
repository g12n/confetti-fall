class Confetti extends HTMLElement {
    static random(min, max) {
        return min + Math.floor(Math.random() * (max - min) + 1);
    }

    static attrs = {
        count: "count", // default: 100
        mode: "mode",
        text: "text", // text in confetti flake (emoji, too)
    }

    connectedCallback() {
		if (window.CSS && CSS.registerProperty) {
			try {
				CSS.registerProperty({
					name: '--spinAngle',
					syntax: '<angle>',
					inherits: false,
					initialValue: '0deg'
				});

				CSS.registerProperty({
					name: '--x',
					syntax: '<length>',
					inherits: false,
					initialValue: '0px'
				});
				CSS.registerProperty({
					name: '--y',
					syntax: '<length>',
					inherits: false,
					initialValue: '0px'
				});
				CSS.registerProperty({
					name: '--confetti-fill',
					syntax: '<color>',
					inherits: true,
					initialValue: '#123'
				});
				
			} catch (e) {
				console.warn(e);
			}	
		} else{
			return
		}

        let count = parseInt(this.getAttribute(Confetti.attrs.count)) || 100;

        let mode;
        if(this.hasAttribute(Confetti.attrs.mode)) {
            mode = this.getAttribute(Confetti.attrs.mode);
        } else {
            mode = this.firstElementChild ? "element" : "page";
            this.setAttribute(Confetti.attrs.mode, mode);
        }

        let shadowroot = this.attachShadow({ mode: "open" });
        
        // Create a style element and append the CSS
        const style = document.createElement('style');
        style.textContent = `
            :host{
				--confetti-fall-size:10px;
                --confetti-fill: var(--confetti-fall-color,#f69);
                --confetti-fill-2: oklch(from var(--confetti-fill) calc(l * 0.75) c h);
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
                font-size: var(--confetti-fall-size, 1em);
            }
            
           
            @keyframes spin {
                to {
                    --spinAngle: 360deg;
                }
            }
        
            
            @keyframes fall {
				 from {
                    --y: -100px;
                }
                to {
                    --y: 1000px;
                }
            }
          
            
            @keyframes drift {
                to {
                    --x: 10vmin;
                }
            }
        
            @keyframes colorshift {
			 	from {
                    --confetti-fill: var(--confetti-fill);
                }
                to {
                    --confetti-fill: var(--confetti-fill-2);
                }
            }
            
            .confetti {
                --y: -10px;
                --x: -10px;
				--tilt:0;
				--tilt-2:0;
                --spinAngle: 0deg;
                --animation-delay: -1s;

				position: absolute;
                pointer-events: none;
            
                width: var(--confetti-fall-size, 100px);
                height: var(--confetti-fall-size, 100px);
                border-radius: 50%;
                background: var(--confetti-fill);
                animation: fall 7.33s linear infinite var(--animation-delay),
                    	   spin 1s linear infinite var(--animation-delay),
                           drift 3s ease-in-out infinite alternate var(--animation-delay),
                           colorshift 0.5s ease-in-out infinite alternate var(--animation-delay);
                transform: translate(var(--x), var(--y))
                    rotate3d(var(--tilt), var(--tilt-2), 0, var(--spinAngle));
                transform-origin: 10% 60%;
            }`;
        
        shadowroot.appendChild(style);

		console.log(shadowroot)
        let d = document.createElement("div");
        d.classList.add("confetti");
        let text = this.getAttribute(Confetti.attrs.text);
        d.innerText = text || "";
        
        for(let j = 0, k = count; j<k; j++) {
            let clone = d.cloneNode(true);
            // Add random initial values for each confetti
            clone.style.setProperty('--animation-delay', `-${Math.random() * 20}s`);
            clone.style.setProperty('--tilt', Math.random());
            clone.style.setProperty('--tilt-2', Math.random());
			clone.style.setProperty('left', Math.random()* 100 + "%");
            shadowroot.appendChild(clone);
        }

        shadowroot.appendChild(document.createElement("slot"));
    }
}

customElements.define("confetti-fall", Confetti);