/* ============================================================
   PIXELBASE — Base64 a imagen
   ============================================================ */
(function () {
  'use strict';

  const { $, formatBytes, toast, setStatus, downloadBlob, copyText } = window.PB;

  const input = $('#base64Input');
  const showBtn = $('#showBtn');
  const clearBtn = $('#clearBtn');
  const status = $('#status');
  const previewPanel = $('#previewPanel');
  const previewImg = $('#previewImg');
  const previewMeta = $('#previewMeta');
  const downloadPng = $('#downloadPng');
  const downloadJpg = $('#downloadJpg');
  const downloadWebp = $('#downloadWebp');
  const copyBase64Btn = $('#copyBase64');

  let currentImage = null;
  let currentBase64 = '';

  function normalizeBase64(value) {
    let v = String(value || '').trim();
    if (!v) return '';
    if (v.startsWith('data:')) return v;
    v = v.replace(/\s/g, '');
    return 'data:image/jpeg;base64,' + v;
  }

  function showImage() {
    const raw = input.value.trim();
    if (!raw) {
      setStatus(status, 'Pega un código Base64 primero.', true);
      previewPanel.style.display = 'none';
      return;
    }

    const dataUri = normalizeBase64(raw);
    currentBase64 = dataUri;

    const img = new Image();
    img.onload = () => {
      currentImage = img;
      previewImg.src = dataUri;
      previewPanel.style.display = 'block';
      const approxBytes = Math.round((dataUri.split(',')[1] || '').length * 0.75);
      previewMeta.textContent =
        img.naturalWidth + ' × ' + img.naturalHeight + ' px · ~' + formatBytes(approxBytes);
      setStatus(status, 'Imagen cargada correctamente.');
    };
    img.onerror = () => {
      previewPanel.style.display = 'none';
      setStatus(status, 'No se pudo cargar la imagen. Verifica que el Base64 esté completo.', true);
    };
    img.src = dataUri;
  }

  function downloadAs(format) {
    if (!currentImage) return;
    const canvas = document.createElement('canvas');
    canvas.width = currentImage.naturalWidth;
    canvas.height = currentImage.naturalHeight;
    const ctx = canvas.getContext('2d');

    if (format !== 'image/png') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(currentImage, 0, 0);

    const mime = format === 'image/jpeg' ? 'image/jpeg' : format === 'image/webp' ? 'image/webp' : 'image/png';
    const ext = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png';
    const quality = mime === 'image/png' ? 1 : 0.92;

    canvas.toBlob((blob) => {
      if (!blob) {
        toast('No se pudo generar la imagen', 'error');
        return;
      }
      downloadBlob(blob, 'pixelbase_' + Date.now() + '.' + ext);
      toast('Descargado en ' + ext.toUpperCase());
    }, mime, quality);
  }

  showBtn.addEventListener('click', showImage);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    previewPanel.style.display = 'none';
    setStatus(status, '');
  });

  downloadPng.addEventListener('click', () => downloadAs('image/png'));
  downloadJpg.addEventListener('click', () => downloadAs('image/jpeg'));
  downloadWebp.addEventListener('click', () => downloadAs('image/webp'));

  copyBase64Btn.addEventListener('click', async () => {
    const ok = await copyText(currentBase64);
    toast(ok ? 'Base64 copiado' : 'No se pudo copiar', ok ? 'success' : 'error');
  });
})();