/* ============================================================
   PIXELBASE — Texto a Base64 y Base64 a texto
   ============================================================ */
(function () {
  'use strict';

  const { $, toast, setStatus, copyText } = window.PB;

  const tabEncode = $('#tabEncode');
  const tabDecode = $('#tabDecode');
  const inputText = $('#inputText');
  const inputLabel = $('#inputLabel');
  const outputPanel = $('#outputPanel');
  const outputText = $('#outputText');
  const outputLabel = $('#outputLabel');
  const convertBtn = $('#convertBtn');
  const clearBtn = $('#clearBtn');
  const copyBtn = $('#copyBtn');
  const status = $('#status');

  let mode = 'encode'; // 'encode' | 'decode'

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  function setMode(next) {
    mode = next;
    if (mode === 'encode') {
      tabEncode.className = 'btn btn-primary';
      tabDecode.className = 'btn btn-secondary';
      inputLabel.textContent = 'Texto a codificar:';
      outputLabel.textContent = 'Resultado en Base64:';
      convertBtn.textContent = 'Codificar a Base64';
      inputText.placeholder = 'Escribe o pega tu texto aquí...';
    } else {
      tabEncode.className = 'btn btn-secondary';
      tabDecode.className = 'btn btn-primary';
      inputLabel.textContent = 'Base64 a decodificar:';
      outputLabel.textContent = 'Texto decodificado:';
      convertBtn.textContent = 'Decodificar a texto';
      inputText.placeholder = 'Pega aquí el código Base64...';
    }
    outputPanel.style.display = 'none';
    setStatus(status, '');
  }

  function convert() {
    const value = inputText.value;
    if (!value) {
      setStatus(status, 'Escribe o pega algo primero.', true);
      return;
    }

    try {
      let result;
      if (mode === 'encode') {
        result = utf8ToBase64(value);
        setStatus(status, 'Texto codificado correctamente.');
      } else {
        const cleaned = value.replace(/\s/g, '');
        result = base64ToUtf8(cleaned);
        setStatus(status, 'Base64 decodificado correctamente.');
      }
      outputText.value = result;
      outputPanel.style.display = 'block';
    } catch (err) {
      outputPanel.style.display = 'none';
      setStatus(status, 'Entrada inválida. ¿Seguro que es Base64 válido?', true);
    }
  }

  tabEncode.addEventListener('click', () => setMode('encode'));
  tabDecode.addEventListener('click', () => setMode('decode'));
  convertBtn.addEventListener('click', convert);
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';
    outputPanel.style.display = 'none';
    setStatus(status, '');
  });
  copyBtn.addEventListener('click', async () => {
    if (!outputText.value) return;
    const ok = await copyText(outputText.value);
    toast(ok ? 'Resultado copiado' : 'No se pudo copiar', ok ? 'success' : 'error');
  });

  setMode('encode');
})();