# `<confetti-fall>`

A lightweight, customizable web component that adds animated confetti effects to your website or specific elements. Based on the [snow-fall](https://www.zachleat.com/web/snow-fall/) component by [Zach Leatherman](https://www.zachleat.com/).

## Features

- Customizable colors and sizes
- Target specific elements or full page


## Installation

```html
<script src="confetti-fall.js"></script>
```

## Usage

### Basic Usage

Add confetti to your page:

```html
<confetti-fall></confetti-fall>
```

### Customization Options

#### Attributes

- `count`: Number of confetti pieces (default: 100)
- `mode`: Display mode ("page" or "element")
- `text`: Text or emoji to use as confetti

```html
<!-- Custom count -->
<confetti-fall count="50"></confetti-fall>

<!-- Element mode with text -->
<confetti-fall mode="element" text="🎉">
    <div>Your content here</div>
</confetti-fall>
```

#### CSS Custom Properties

Customize the appearance using these CSS variables:

```css
confetti-fall {
    /* Size of confetti pieces */
    --confetti-fall-size: 15px;
    
    /* Primary confetti color */
    --confetti-fall-color: #ff6699;
}
```

### Display Modes

#### Page Mode (Default when empty)
Covers the entire viewport:

```html
<confetti-fall mode="page"></confetti-fall>
```

#### Element Mode
Confetti appears within a specific element:

```html
<confetti-fall mode="element">
    <div class="my-container">
        Content goes here
    </div>
</confetti-fall>
```

### Examples

1. Celebration effect:
```html
<confetti-fall count="200" text="🎉"></confetti-fall>
```

2. Custom colored confetti in a container:
```html
<style>
    .celebration-box {
        --confetti-fall-color: #ffd700;
        --confetti-fall-size: 12px;
    }
</style>
<confetti-fall mode="element" class="celebration-box">
    <div>Congratulations!</div>
</confetti-fall>
```

## Browser Support

Requires browsers that support:
- Custom Elements v1
- CSS Custom Properties
- CSS `@property` (for smooth animations)

## Credits

- Original inspiration: [snow-fall](https://www.zachleat.com/web/snow-fall/) by Zach Leatherman
- Based on this [CodePen](https://codepen.io/g12n/pen/egMjNq)

## License

MIT License