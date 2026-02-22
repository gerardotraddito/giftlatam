// ============================================
// GIFTLATAM — Búsqueda global conectada a Supabase
// Requiere: supabase.js cargado antes
// ============================================

let searchTimeout = null;
let currentAcResults = [];

// ── Autocomplete con debounce → consulta real a DB ──
async function doSearch(val) {
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';

  const acList = document.getElementById('acList') || document.getElementById('autocompleteList');
  if (!acList) return;

  if (!val || val.trim().length < 1) {
    acList.style.display = 'none';
    // Si estamos en explorar, refrescar con todos
    if (typeof renderCards === 'function') { searchQuery = ''; renderCards(); }
    return;
  }

  // Debounce 200ms para no spamear la DB
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    const q = val.trim().toLowerCase();

    // Si estamos en explorar.html → filtrar lista ya cargada
    if (typeof renderCards === 'function') {
      searchQuery = q;
      renderCards();
    }

    // Autocomplete: buscar en DB
    const { data } = await sb
      .from('gift_cards')
      .select('id, titulo, marca, precio_venta, tipo')
      .eq('estado', 'activo')
      .or(`titulo.ilike.%${val}%,marca.ilike.%${val}%`)
      .limit(7);

    currentAcResults = data || [];
    renderAutocomplete(currentAcResults, val, acList);
  }, 200);
}

// ── Renderizar dropdown de sugerencias ──
function renderAutocomplete(results, query, container) {
  if (!container) return;

  if (!results.length) {
    container.innerHTML = `<div style="padding:14px 16px;color:#888;font-size:13px;text-align:center">Sin resultados para "<strong>${query}</strong>"</div>`;
    container.style.display = 'block';
    return;
  }

  const catIcons = { gaming:'🎮', streaming:'🎬', retail:'🛒', comida:'🍔', musica:'🎵', viajes:'✈️', otro:'📄', cuenta:'👤', licencia:'🔑', gift_card:'🎁' };

  container.innerHTML = results.map(item => {
    const icon = catIcons[item.tipo] || '🎁';
    const highlighted = highlight(item.titulo, query);
    return `
      <div class="ac-item" onclick="pickResult('${item.id}','${item.titulo.replace(/'/g,"\\'")}')">
        <div class="ac-icon">${icon}</div>
        <div style="flex:1;min-width:0">
          <div class="ac-name">${highlighted}</div>
          <div class="ac-cat">${item.marca}</div>
        </div>
        <div class="ac-price">$${parseFloat(item.precio_venta).toFixed(2)}</div>
      </div>`;
  }).join('');

  container.style.display = 'block';
}

// ── Resaltar texto coincidente ──
function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0,idx) + '<mark style="background:none;color:#00C853;font-weight:700">' + text.slice(idx, idx+query.length) + '</mark>' + text.slice(idx+query.length);
}

// ── Seleccionar resultado ──
function pickResult(id, name) {
  const input = document.getElementById('searchInput');
  if (input) input.value = name;
  const acList = document.getElementById('acList') || document.getElementById('autocompleteList');
  if (acList) acList.style.display = 'none';

  // Si estamos en explorar → filtrar
  if (typeof renderCards === 'function') {
    searchQuery = name.toLowerCase();
    renderCards();
  } else {
    // Sino → ir a detalle
    window.location.href = 'detalle.html?id=' + id;
  }
}

// ── Limpiar búsqueda ──
function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) clearBtn.style.display = 'none';
  const acList = document.getElementById('acList') || document.getElementById('autocompleteList');
  if (acList) acList.style.display = 'none';
  if (typeof renderCards === 'function') { searchQuery = ''; renderCards(); }
  if (input) input.focus();
}

// ── Cerrar autocomplete al tocar afuera ──
document.addEventListener('click', function(e) {
  const wrap = e.target.closest('.search-wrap, .search-bar-mobile');
  if (!wrap) {
    const acList = document.getElementById('acList') || document.getElementById('autocompleteList');
    if (acList) acList.style.display = 'none';
  }
});

// ── Enter → ir a explorar con query ──
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.location.href = 'explorar.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  }
});
