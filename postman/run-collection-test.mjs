/**
 * Simule le parcours Postman contre l'API locale.
 * Usage: node postman/run-collection-test.mjs
 */
const BASE = 'http://localhost:8080/api';

const results = [];
let token = '';
let sellerUserId = '';
let categoryId = '1';
let productId = '1';
let adminCategoryId = null;

function log(name, ok, status, detail = '') {
  results.push({ name, ok, status, detail });
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark} | ${status} | ${name}${detail ? ' — ' + detail : ''}`);
}

async function req(name, method, path, { body, form, auth = null, expect } = {}) {
  const headers = {};
  if (auth === 'seller' || auth === 'admin') {
    headers.Authorization = `Bearer ${token}`;
  }
  let fetchBody;
  if (body) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  } else if (form) {
    fetchBody = form;
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: fetchBody });
  } catch (e) {
    log(name, false, 'ERR', e.message);
    return null;
  }

  const expected = Array.isArray(expect) ? expect : [expect];
  const ok = expected.includes(res.status);
  let detail = '';
  if (!ok) {
    try {
      const t = await res.clone().text();
      detail = t.slice(0, 120);
    } catch {}
  }
  log(name, ok, res.status, detail);
  if (!ok) return null;

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json();
  }
  return res;
}

async function main() {
  console.log('=== Assigamé — vérification collection Postman ===\n');

  // 02 Public
  const health = await req('Santé API', 'GET', '/health', { expect: 200 });
  if (health?.status !== 'UP') log('Santé status UP', false, 200, `got ${health?.status}`);

  const products = await req('Liste produits', 'GET', '/produit/list', { expect: 200 });
  if (products?.length) productId = String(products[0].id_produit);

  await req('Détail produit', 'GET', `/produit/${productId}`, { expect: 200 });
  await req('Image produit', 'GET', `/produit/${productId}/image`, { expect: [200, 404] });

  const categories = await req('Liste catégories', 'GET', '/categorieproduit/list', { expect: 200 });
  if (categories?.length) categoryId = String(categories[0].idcategorie_produit);

  await req('Détail catégorie', 'GET', `/categorieproduit/${categoryId}`, { expect: 200 });
  await req('Image catégorie', 'GET', `/categorieproduit/${categoryId}/image`, { expect: [200, 404] });

  const registerEmail = `test.postman.${Date.now()}@assigame.tg`;
  await req('Inscription vendeur', 'POST', '/users/add', {
    expect: 200,
    body: {
      nom_utilisateur: 'Test',
      prenom_utilisateur: 'Postman',
      sexe_utilisateur: 'M',
      telephone_utilisateur: '+22890111222',
      mail_utilisateur: registerEmail,
      password_utilisateur: 'test12345',
      residence_utilisateur: 'Lomé',
    },
  });

  await req('Liste types utilisateur', 'GET', '/typeutilisateur/list', { expect: 200 });

  // 01 Auth — Vendeur
  const loginSeller = await req('Login Vendeur', 'POST', '/auth/login', {
    expect: 200,
    body: { email: 'kodjo@assigame.tg', password: 'seller123' },
  });
  if (loginSeller?.token) {
    token = loginSeller.token;
    sellerUserId = String(loginSeller.user?.id_utilisateur ?? '');
  }

  await req('Profil connecté (vendeur)', 'GET', '/auth/me', { auth: 'seller', expect: 200 });

  // 03 Vendeur
  const allProducts = await req('Mes produits (liste)', 'GET', '/produit/list', { auth: 'seller', expect: 200 });
  const sellerId = Number(sellerUserId);
  const mine = (allProducts || []).filter((p) => p.utilisateur && Number(p.utilisateur.id_utilisateur) === sellerId);
  if (mine.length) {
    productId = String(mine[0].id_produit);
    log('productId vendeur trouvé', true, 200, productId);
  } else {
    log('productId vendeur trouvé', false, 0, 'aucun produit vendeur — on en crée un');
  }

  const created = await req('Créer produit (image URL)', 'POST', '/produit/add', {
    auth: 'seller',
    expect: 200,
    form: (() => {
      const fd = new FormData();
      fd.append('nom_produit', 'Produit test Postman');
      fd.append('statut', 'actif');
      fd.append('description', 'Créé via script');
      fd.append('prix', '35000');
      fd.append('id_categorie', categoryId);
      fd.append('id_utilisateur', sellerUserId);
      fd.append('image_url', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
      return fd;
    })(),
  });
  if (created?.id_produit) productId = String(created.id_produit);

  await req('Modifier produit', 'PUT', `/produit/update/${productId}`, {
    auth: 'seller',
    expect: 200,
    form: (() => {
      const fd = new FormData();
      fd.append('nom_produit', 'Produit modifié Postman');
      fd.append('prix', '38000');
      fd.append('statut', 'actif');
      return fd;
    })(),
  });

  await req('Changer image produit', 'POST', `/produit/${productId}/upload-image`, {
    auth: 'seller',
    expect: 200,
    form: (() => {
      const fd = new FormData();
      fd.append('image_url', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
      return fd;
    })(),
  });

  await req('Supprimer produit', 'DELETE', `/produit/delete/${productId}`, { auth: 'seller', expect: 200 });

  // 01 Auth — Admin
  const loginAdmin = await req('Login Admin', 'POST', '/auth/login', {
    expect: 200,
    body: { email: 'admin@assigame.tg', password: 'admin123' },
  });
  if (loginAdmin?.token) token = loginAdmin.token;

  await req('Liste utilisateurs (admin)', 'GET', '/users/list', { auth: 'admin', expect: 200 });

  const newCat = await req('Ajouter catégorie', 'POST', '/categorieproduit/add', {
    auth: 'admin',
    expect: 200,
    body: { nom_categorieproduit: 'Test Postman', description: 'Catégorie créée via script' },
  });
  if (newCat?.idcategorie_produit) adminCategoryId = String(newCat.idcategorie_produit);

  if (adminCategoryId) {
    await req('Modifier catégorie', 'PUT', `/categorieproduit/update/${adminCategoryId}`, {
      auth: 'admin',
      expect: 200,
      body: { nom_categorieproduit: 'Test Postman modifié', description: 'Mise à jour' },
    });

    await req('Image catégorie (upload)', 'POST', `/categorieproduit/${adminCategoryId}/upload-image`, {
      auth: 'admin',
      expect: 200,
      form: (() => {
        const fd = new FormData();
        fd.append('image_url', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800');
        return fd;
      })(),
    });

    await req('Supprimer catégorie test', 'DELETE', `/categorieproduit/delete/${adminCategoryId}`, {
      auth: 'admin',
      expect: 200,
    });
  }

  // 05 Erreurs
  await req('Login mauvais mot de passe', 'POST', '/auth/login', {
    expect: 401,
    body: { email: 'kodjo@assigame.tg', password: 'mauvais' },
  });

  await req('GET /auth/me sans token', 'GET', '/auth/me', { expect: 401 });

  const loginSeller2 = await req('Login Vendeur (pour 403)', 'POST', '/auth/login', {
    expect: 200,
    body: { email: 'kodjo@assigame.tg', password: 'seller123' },
  });
  if (loginSeller2?.token) token = loginSeller2.token;

  await req('Vendeur → liste users (403)', 'GET', '/users/list', { auth: 'seller', expect: 403 });

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Résultat: ${passed}/${results.length} OK ===`);
  if (failed.length) {
    console.log('\nÉchecs:');
    failed.forEach((f) => console.log(`  - ${f.name} (${f.status}) ${f.detail}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
