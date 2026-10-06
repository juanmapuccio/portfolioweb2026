// Gate for the 3D belt. No import of three here: this file is part of the initial bundle.
// Every condition must hold, otherwise nothing loads and the static poster stays.

interface NetworkInformation {
  saveData?: boolean;
}

/** Throwaway canvas: is any WebGL context available at all? */
function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return false;
    // Release the probe context right away so it never counts against the browser's context limit.
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function isBelt3dEligible(): boolean {
  if (!matchMedia('(min-width: 1024px)').matches) return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (connection?.saveData === true) return false;
  return hasWebGL();
}
