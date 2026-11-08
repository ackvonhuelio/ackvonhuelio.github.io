import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { damp, mouseRotationTarget } from './cameraMotion.js'

const settings = { pitch: 0.2, yawNarrow: 0.3, yawWide: 0.05, damping: 3 }

test('mouse rotation follows scroll progress and viewport limits', () => {
  const pointer = { x: 1, y: 1 }
  assert.deepEqual(mouseRotationTarget(pointer, 480, 1, settings), { pitch: 0.2, yaw: -0.3 })
  const wide = mouseRotationTarget(pointer, 1920, 1, settings)
  assert.equal(wide.pitch, 0.2)
  assert.ok(Math.abs(wide.yaw - -0.05) < 1e-12)
  const midway = mouseRotationTarget(pointer, 1200, 0.5, settings)
  assert.ok(Math.abs(midway.yaw - -0.0875) < 1e-12)
  assert.equal(midway.pitch, 0.1)
  assert.deepEqual(mouseRotationTarget(pointer, 480, 0, settings), { pitch: 0, yaw: -0 })
  assert.deepEqual(mouseRotationTarget(pointer, 480, 1, {
    ...settings, pitch: 0, yawNarrow: 0, yawWide: 0,
  }), { pitch: 0, yaw: -0 })
})

test('damping controls response independently and is frame-rate independent', () => {
  assert.ok(damp(0, 1, 6, 0.1) > damp(0, 1, 1, 0.1))
  assert.ok(Math.abs(damp(damp(0, 1, 3, 0.1), 1, 3, 0.1) - damp(0, 1, 3, 0.2)) < 1e-12)
})

test('matching damping preserves the previous combined camera smoothing', () => {
  const base = damp(0.1, 0.25, 3, 0.016)
  const mouse = damp(-0.02, -0.1, 3, 0.016)
  const combined = damp(0.08, 0.15, 3, 0.016)
  assert.ok(Math.abs(base + mouse - combined) < 1e-12)
})
