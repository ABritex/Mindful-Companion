# CSS File Structure

This project uses a modular CSS approach for better organization and maintainability.

## File Organization

### `globals.css` (Main Entry Point)
- **Purpose**: Main CSS file that imports all other CSS modules
- **Contains**: 
  - Tailwind CSS import
  - CSS variable definitions (colors, themes)
  - Theme configurations
  - Basic layout styles
  - Dark mode overrides

### `fonts.css` (Font Management)
- **Purpose**: All font-related declarations and variables
- **Contains**:
  - `@font-face` declarations for Helvetica and Century Gothic
  - Font family variables
  - Font fallback stacks

### `animations.css` (Animation System)
- **Purpose**: All animation keyframes and animation classes
- **Contains**:
  - Blob animation keyframes (blob-float-1 through blob-float-5)
  - Particle animation keyframes (particle-float-1 through particle-float-4)
  - Animation utility classes
  - Animation performance optimizations

### `typography.css` (Typography System)
- **Purpose**: Typography styles and utility classes
- **Contains**:
  - Font utility classes (`.font-heading`, `.font-body`, `.font-mono`)
  - Heading styles (h1-h6 with Century Gothic)
  - Body text styles (with Helvetica)
  - Font weight utilities (`.text-light`, `.text-regular`, `.text-bold`)

## Usage

### Font Usage
```tsx
// Automatic (recommended)
<h1>This uses Century Gothic automatically</h1>
<p>This uses Helvetica automatically</p>

// Manual control
<div className="font-heading">Century Gothic text</div>
<div className="font-body">Helvetica text</div>
<div className="text-light">Light weight text</div>
<div className="text-bold">Bold weight text</div>
```

### Animation Usage
```tsx
// Blob animations
<div className="animate-blob-float-1">Floating blob 1</div>
<div className="animate-blob-float-2">Floating blob 2</div>

// Particle animations
<div className="animate-particle-float-1">Floating particle 1</div>
<div className="animate-particle-float-2">Floating particle 2</div>
```

## Benefits of This Structure

1. **Modularity**: Each file has a single responsibility
2. **Maintainability**: Easier to find and modify specific styles
3. **Performance**: Better caching and loading strategies
4. **Team Collaboration**: Multiple developers can work on different aspects
5. **Scalability**: Easy to add new modules as the project grows

## Adding New Styles

- **New fonts**: Add to `fonts.css`
- **New animations**: Add to `animations.css`
- **New typography**: Add to `typography.css`
- **New global styles**: Add to `globals.css`
- **New modules**: Create new CSS files and import in `globals.css` 