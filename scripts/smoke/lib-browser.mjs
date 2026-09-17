/**
 * Keep browser-based smoke tests independent from Windows/CI GPU drivers.
 * Large high-density Phaser canvases can otherwise fail before the first
 * scene with "Framebuffer Unsupported", producing misleading test failures.
 */
export function smokeBrowserLaunchOptions() {
  return {
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
  };
}
