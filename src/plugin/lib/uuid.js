/**
 * 生成16位uuid
 */
export function genUUID16() {
  const p0 = `00000000${Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)}`.substr(-8);
  const p1 = `00000000${Math.abs((Math.random() * 0xFFFFFFFF) | 0).toString(16)}`.substr(-8);
  return `qy_${p0}${p1}`;
}
