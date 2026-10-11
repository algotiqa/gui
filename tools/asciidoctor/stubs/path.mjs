function join(...parts) {
  return parts.filter(Boolean).join('/').replace(/\/+/g, '/');
}

function dirname(p) {
  const i = p.lastIndexOf('/');
  return i < 0 ? '.' : (i === 0 ? '/' : p.slice(0, i));
}

function basename(p) {
  const i = p.lastIndexOf('/');
  return i < 0 ? p : p.slice(i + 1);
}

function isAbsolute(p) {
  return p.startsWith('/');
}

function resolve(...parts) {
  return join(...parts);
}

function extname(p) {
  const b = basename(p);
  const i = b.lastIndexOf('.');
  return i <= 0 ? '' : b.slice(i);
}

export {join, dirname, basename, isAbsolute, resolve, extname};
export default {join, dirname, basename, isAbsolute, resolve, extname};
