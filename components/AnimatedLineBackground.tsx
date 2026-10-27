'use client';

export default function AnimatedLineBackground() {
  return (
    <div
      aria-hidden="true"
      className="ambient-background"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <div
        className="ambient-line ambient-line-one"
        style={{
          position: 'absolute',
          top: '-34vh',
          left: '-8vw',
          width: '58vw',
          height: '58vw',
          border: '2px solid color-mix(in srgb, var(--color-accent) 18%, transparent)',
          borderRadius: '50%',
        }}
      />
      <div
        className="ambient-line ambient-line-two"
        style={{
          position: 'absolute',
          top: '-8vh',
          right: '24vw',
          width: '22vw',
          height: '70vh',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
      <div
        className="ambient-line ambient-line-three"
        style={{
          position: 'absolute',
          right: '-10vw',
          top: '-18vh',
          width: '42vw',
          height: '78vh',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
      <div
        className="ambient-line ambient-line-four"
        style={{
          position: 'absolute',
          left: '18vw',
          bottom: '-42vh',
          width: '46vw',
          height: '46vw',
          border: '2px solid color-mix(in srgb, var(--color-accent) 14%, transparent)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
