/**
 * Keep browser-based smoke tests independent from Windows/CI GPU drivers.
 * Large high-density Phaser canvases can otherwise fail before the first
 * scene with "Framebuffer Unsupported", producing misleading test failures.
 */
export function smokeBrowserLaunchOptions() {
  // Explicit local option for Windows high-density checks. CI stays on the
  // deterministic software renderer unless the operator requests the GPU.
  const hardware = process.platform === 'win32' && process.env.SMOKE_GPU === 'd3d11';
  return {
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: hardware ? ['--use-gl=angle', '--use-angle=d3d11']
      : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  };
}
