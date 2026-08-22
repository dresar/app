const { db } = require('./db');

function flash(req, type, msg) {
  req.session._flash = { type, msg };
}

function locals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = req.session._flash || null;
  req.session._flash = null;
  res.locals.h = require('./helpers');

  const settings = {};
  db.prepare('SELECT key, value FROM settings').all().forEach((r) => { settings[r.key] = r.value; });
  res.locals.site = settings;
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    flash(req, 'error', 'Silakan masuk terlebih dahulu.');
    return res.redirect('/masuk');
  }
  const user = db.prepare('SELECT is_active FROM users WHERE id = ?').get(req.session.user.id);
  if (!user || !user.is_active) {
    delete req.session.user;
    flash(req, 'error', 'Akun Anda tidak aktif. Hubungi admin.');
    return res.redirect('/masuk');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    flash(req, 'error', 'Halaman ini khusus admin.');
    return res.redirect('/masuk');
  }
  next();
}

module.exports = { flash, locals, requireAuth, requireAdmin };
