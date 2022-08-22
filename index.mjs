export default function v(k, v) {
  return (p) => (v[p[k]] === null ? null : v[p[k]] ?? v.DEFAULT);
}
