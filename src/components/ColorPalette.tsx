interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  return (
    <ul className="palette" aria-label="Color palette">
      {colors.map((color, index) => (
        <li
          key={`${color}-${index}`}
          style={{ backgroundColor: color }}
          title={color}
          aria-label={color}
        />
      ))}
    </ul>
  );
}
