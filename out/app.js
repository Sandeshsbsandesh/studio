// Minimal mobile app shell using global Firebase (auth + firestore)
const appRoot = document.getElementById('app');

// Screens
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') e.className = v; else if (k === 'onclick') e.onclick = v; else e.setAttribute(k, v);
  });
  ([]).concat(children).forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return e;
}

let currentUser = null;
let isAuthenticated = false;

const services = [
  { id: 'water-can-delivery', title: 'Water Can Delivery', desc: 'Fresh water delivered', icon: '💧' },
  { id: 'house-maids', title: 'House Maids', desc: 'Professional cleaning', icon: '🧹' },
  { id: 'electricians', title: 'Electricians', desc: 'Repairs & installs', icon: '⚡' },
  { id: 'plumbers', title: 'Plumbers', desc: 'Quick plumbing fixes', icon: '🔧' },
  { id: 'doctor-on-call', title: 'Doctor on Call', desc: 'Home consultation', icon: '🩺' },
  { id: 'cylinder-delivery', title: 'Cylinder Delivery', desc: 'LPG to doorstep', icon: '🔥' },
  { id: 'cleaners', title: 'Cleaners', desc: 'Deep cleaning', icon: '✨' },
  { id: 'personal-cooks', title: 'Personal Cooks', desc: 'Home chefs', icon: '👨‍🍳' },
  { id: 'local-buddy', title: 'Local Buddy', desc: 'Help for errands', icon: '🤝' },
  { id: 'shifters', title: 'Shifters', desc: 'Moving services', icon: '🚚' },
  { id: 'painters', title: 'Painters', desc: 'Interior/Exterior', icon: '🎨' }
];

function renderLogin() {
  const email = el('input', { class: 'input', type: 'email', placeholder: 'Email', id: 'email' });
  const password = el('input', { class: 'input', type: 'password', placeholder: 'Password', id: 'password', style: 'margin-top:8px' });
  const btn = el('button', { class: 'btn', style: 'margin-top:12px', onclick: doLogin }, ['Login']);
  const wrap = el('div', { class: 'screen active' }, [
    el('div', { class: 'header' }, [
      el('div', { class: 'logo' }, [el('img', { src: '/logo final done@3x (1).png', style: 'width:80px;height:80px;object-fit:contain' })]),
      el('h1', {}, ['UrbanEzii']),
      el('p', { class: 'subtitle' }, ['Sign in to continue'])
    ]),
    el('div', { class: 'card' }, [email, password, btn])
  ]);
  appRoot.replaceChildren(wrap, renderNav('login'));
}

async function doLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const cred = await window.signInWithEmailAndPassword(window.auth, email, password);
    currentUser = { uid: cred.user.uid, email: cred.user.email };
    isAuthenticated = true;
    renderHome();
  } catch (e) {
    alert(e.message || 'Login failed');
  }
}

function renderHome() {
  if (!isAuthenticated) return renderLogin();
  const grid = el('div', { class: 'grid' }, services.map(s => {
    return el('div', { class: 'card', onclick: () => openService(s.id, s.title) }, [
      el('div', { style: 'font-size:28px' }, [s.icon]),
      el('div', { style: 'font-weight:700;margin-top:6px' }, [s.title]),
      el('div', { style: 'color:#64748b;margin-top:4px;font-size:12px' }, [s.desc])
    ]);
  }));
  const sc = el('div', { class: 'screen active' }, [
    el('div', { class: 'header' }, [
      el('div', { class: 'logo' }, [el('img', { src: '/logo final done@3x (1).png', style: 'width:80px;height:80px;object-fit:contain' })]),
      el('h1', {}, ['UrbanEzii']),
      el('p', { class: 'subtitle' }, ['Popular Services'])
    ]),
    grid
  ]);
  appRoot.replaceChildren(sc, renderNav('home'));
}

async function openService(serviceId, title) {
  if (!isAuthenticated) return renderLogin();
  const list = el('div', { class: 'card' }, [el('div', { class: 'spinner' })]);
  const sc = el('div', { class: 'screen active' }, [
    el('div', { class: 'header' }, [el('h1', {}, [title])]),
    list
  ]);
  appRoot.replaceChildren(sc, renderNav('services'));

  try {
    const snap = await window.getDocs(window.collection(window.db, 'services', serviceId, 'providers'));
    list.replaceChildren();
    if (snap.empty) {
      list.appendChild(el('div', {}, ['No providers found']));
    } else {
      snap.forEach(doc => {
        const p = doc.data();
        list.appendChild(el('div', { class: 'card', style: 'margin-top:8px' }, [
          el('div', { style: 'font-weight:700' }, [p.name || 'Provider']),
          el('div', { style: 'color:#64748b;margin-top:4px' }, [p.address || ''])
        ]));
      });
    }
  } catch (e) {
    list.replaceChildren(el('div', {}, ['Failed to load providers']));
  }
}

function renderNav(active) {
  return el('div', { class: 'nav' }, [
    el('div', { class: 'item' + (active === 'home' ? ' active' : ''), onclick: renderHome }, ['🏠','Home']),
    el('div', { class: 'item' + (active === 'services' ? ' active' : ''), onclick: () => renderHome() }, ['🧰','Services']),
    el('div', { class: 'item' + (active === 'login' ? ' active' : ''), onclick: renderLogin }, ['👤','Profile'])
  ]);
}

// Auth state
window.onAuthStateChanged(window.auth, (user) => {
  if (user) {
    currentUser = { uid: user.uid, email: user.email };
    isAuthenticated = true;
    renderHome();
  } else {
    currentUser = null;
    isAuthenticated = false;
    renderLogin();
  }
});
