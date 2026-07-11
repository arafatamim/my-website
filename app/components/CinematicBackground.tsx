import "./CinematicBackground.scss";

/**
 * Decorative cinematic backdrop: a slow terracotta ink-drift plus animated film
 * grain, both pure SVG turbulence (no video, no assets). Behind the page content
 * and pointer-transparent. Disabled on mobile (perf) and reduced-motion (CSS).
 */
export default function CinematicBackground() {
  return (
    <>
      {/* slow ink cloud drifting behind the content */}
      <svg className="fx fx--ink" aria-hidden="true" preserveAspectRatio="none">
        <filter id="fx-ink" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.016"
            numOctaves="3"
            seed="7"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="34s"
              values="0.011 0.016;0.015 0.012;0.011 0.016"
              repeatCount="indefinite"
            />
          </feTurbulence>
          {/* paint the noise as terracotta with noise-driven alpha */}
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.77
                    0 0 0 0 0.44
                    0 0 0 0 0.25
                    0.5 0 0 0 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#fx-ink)" />
      </svg>

      {/* fine film grain over everything, jittered at ~10fps */}
      <svg className="fx fx--grain" aria-hidden="true" preserveAspectRatio="none">
        <filter id="fx-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
            result="noise"
          >
            <animate
              attributeName="seed"
              dur="0.9s"
              calcMode="discrete"
              values="1;3;5;7;9;11;13;15"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feColorMatrix in="noise" type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fx-grain)" />
      </svg>
    </>
  );
}
