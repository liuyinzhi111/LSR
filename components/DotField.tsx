type DotFieldProps = {
  color: string;
  fadeIn: string;
  fadeOut: string;
};

/** Static grid plus a small movable highlight, instead of a full-screen changing mask. */
export default function DotField({ color, fadeIn, fadeOut }: DotFieldProps) {
  const fade = `linear-gradient(180deg, transparent 0%, #000 ${fadeIn}, #000 ${fadeOut}, transparent 100%)`;
  const spotlight = 'radial-gradient(circle 110px at 128px 128px, #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)';
  return (
    <div data-dot-field aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        WebkitMaskImage: fade, maskImage: fade,
      }} />
      <div data-dot-hotspot style={{
        position: 'absolute', left: 0, top: 0, width: 256, height: 256,
        transform: 'translate3d(-512px, -512px, 0)',
        backgroundImage: 'radial-gradient(rgba(255,90,26,0.55) 1.6px, transparent 2.2px)',
        backgroundSize: '24px 24px',
        WebkitMaskImage: spotlight, maskImage: spotlight,
        opacity: 0, transition: 'opacity 0.12s ease',
        contain: 'paint', willChange: 'transform',
      }} />
    </div>
  );
}
