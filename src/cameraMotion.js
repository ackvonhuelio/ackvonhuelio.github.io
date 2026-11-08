const NARROW_WIDTH = 480
const WIDE_WIDTH = 1920

export const damp = (current, target, speed, delta) =>
  current + (target - current) * (1 - Math.exp(-delta * speed))

export const mouseRotationTarget = (pointer, width, factor, settings) => {
  const t = Math.min(1, Math.max(0, (width - NARROW_WIDTH) / (WIDE_WIDTH - NARROW_WIDTH)))
  const yawLimit = settings.yawNarrow + (settings.yawWide - settings.yawNarrow) * t
  return {
    pitch: pointer.y * settings.pitch * factor,
    yaw: -pointer.x * yawLimit * factor,
  }
}
