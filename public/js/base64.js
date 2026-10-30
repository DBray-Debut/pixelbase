/* ============================================================
   PIXELBASE — Convertidor imagen <-> Base64
   ============================================================ */
(function () {
  'use strict';

  const { $, formatBytes, safeName, toast, setStatus, copyText, downloadBlob, initDropzone } = window.PB;

  // ---------- Estado ----------
  let items = [];
  let nextId = 1;

  // ---------- DOM ----------
  const dropzone = $('#dropzone');
  const fileInput = $('#fileInput');
  const results = $('#results');
  const status = $('#status');
  const modeSelect = $('#mode');
  const wrapCheck = $('#wrap');
  const clearBtn = $('#clearAll');

  // ---------- Utilidades ----------
  function buildOutput(item) {
    const mode = modeSelect.value;
    const wrap = wrapCheck.checked;
    const name = safeName(item.file.name);

    if (mode === 'base64') return item.pureBase64;

    if (mode === 'img') {
      return wrap
        ? `<img src="${item.dataUri}" alt="${name}">`
        : item.dataUri;
    }

    if (mode === 'css') {
      return wrap
        ? `background-image: url("${item.dataUri}");`
        : item.dataUri;
    }

    return item.dataUri;
  }

  // ---------- Carga de archivos ----------
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('No se pudo leer ' + file.name));
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    const valid = files.filter((f) => f.type.startsWith('image/'));
    if (!valid.length) {
      setStatus(status, 'No se encontraron imágenes válidas.', true);
      return;
    }

    setStatus(status, 'Procesando ' + valid.length + ' imagen(es)...');

    for (const file of valid) {
      try {
        const dataUri = await readFile(file);
        const pureBase64 = dataUri.split(',')[1] || '';
        const item = {
          id: nextId++,
          file,
          dataUri,
          pureBase64,
          width: null,
          height: null
        };

        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            item.width = img.naturalWidth;
            item.height = img.naturalHeight;
            resolve();
          };
          img.onerror = resolve;
          img.src = dataUri;
        });

        items.push(item);
      } catch (err) {
        console.error(err);
      }
    }

    render();
    setStatus(status, valid.length + ' imagen(es) procesadas.');
  }

  // ---------- Render ----------
  function render() {
    if (!results) return;

    results.innerHTML = '';

    if (!items.length) {
      results.innerHTML = '<div class="empty">Todavía no hay imágenes. Selecciona o arrastra una o varias para comenzar.</div>';
      return;
    }

    const frag = document.createDocumentFragment();

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'result-card';

      const img = document.createElement('img');
      img.src = item.dataUri;
      img.alt = item.file.name;
      img.loading = 'lazy';

      const body = document.createElement('div');
      body.className = 'result-body';

      const name = document.createElement('div');
      name.className = 'result-name';
      name.textContent = item.file.name;

      const meta = document.createElement('div');
      meta.className = 'result-meta';
      meta.textContent =
        formatBytes(item.file.size) +
        ' · ' + item.width + '×' + item.height + ' px' +
        ' · Base64: ' + formatBytes(item.pureBase64.length);

      body.appendChild(name);
      body.appendChild(meta);

      const actions = document.createElement('div');
      actions.className = 'result-actions';

      const btnCopy = document.createElement('button');
      btnCopy.className = 'btn btn-primary';
      btnCopy.type = 'button';
      btnCopy.textContent = 'Copiar';
      btnCopy.addEventListener('click', async () => {
        const ok = await copyText(buildOutput(item));
        toast(ok ? 'Código copiado' : 'No se pudo copiar', ok ? 'success' : 'error');
      });

      const btnDownload = document.createElement('button');
      btnDownload.className = 'btn btn-secondary';
      btnDownload.type = 'button';
      btnDownload.textContent = 'TXT';
      btnDownload.addEventListener('click', () => {
        const blob = new Blob([buildOutput(item)], { type: 'text/plain;charset=utf-8' });
        downloadBlob(blob, safeName(item.file.name) + '_base64.txt');
        toast('TXT descargado');
      });

      const btnRemove = document.createElement('button');
      btnRemove.className = 'btn btn-ghost';
      btnRemove.type = 'button';
      btnRemove.textContent = '✕';
      btnRemove.title = 'Quitar';
      btnRemove.addEventListener('click', () => {
        items = items.filter((x) => x.id !== item.id);
        render();
      });

      actions.appendChild(btnCopy);
      actions.appendChild(btnDownload);
      actions.appendChild(btnRemove);

      card.appendChild(img);
      card.appendChild(body);
      card.appendChild(actions);
      frag.appendChild(card);
    });

    results.appendChild(frag);
  }

  // ---------- Eventos ----------
  initDropzone(dropzone, fileInput, handleFiles);

  if (modeSelect) modeSelect.addEventListener('change', render);
  if (wrapCheck) wrapCheck.addEventListener('change', render);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      items = [];
      render();
      setStatus(status, 'Lista limpiada.');
    });
  }

  render();
})();