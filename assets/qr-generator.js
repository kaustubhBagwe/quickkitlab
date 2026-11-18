
/* QuickKitLab QR Generator — client-side only */

(() => {
  'use strict';

  const $ = id => document.getElementById(id);

  const form = $('qrForm');
  const status = $('qrStatus');
  const output = $('qrCanvasOutput');

  const downloadPng = $('qrDownloadPng');
  const downloadJpg = $('qrDownloadJpg');

  if (!form || !output) return;

  let activeType = 'website';
  let generatedCanvas = null;

  const fields = {
    website: {
      label: 'Website URL',
      placeholder: 'https://example.com',
      type: 'url',
      hint: 'Include https:// for the best scanning experience.'
    },
    text: {
      label: 'Your text',
      placeholder: 'Type your message here...',
      type: 'textarea'
    },
    email: {
      label: 'Email address',
      placeholder: 'hello@example.com',
      type: 'email'
    },
    wifi: {
      label: 'Wi-Fi network name (SSID)',
      placeholder: 'Your Wi-Fi name',
      type: 'wifi'
    },
    phone: {
      label: 'Phone number',
      placeholder: '+91 98765 43210',
      type: 'tel'
    },
    whatsapp: {
      label: 'WhatsApp number',
      placeholder: '919876543210',
      type: 'tel'
    }
  };

  function setStatus(message, state = '') {
    status.textContent = message;
    status.dataset.state = state;
  }

  function renderInput() {
    const config = fields[activeType];
    const holder = $('qrDynamicField');

    holder.replaceChildren();

    const label = document.createElement('label');
    label.htmlFor = 'qrValue';
    label.textContent = config.label;

    let input;

    if (config.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = config.type === 'wifi' ? 'text' : config.type;
      input.autocomplete = 'off';
    }

    input.id = 'qrValue';
    input.name = 'qrValue';
    input.placeholder = config.placeholder;
    input.required = true;

    holder.append(label, input);

    if (activeType === 'wifi') {
      const security = document.createElement('select');
      security.id = 'qrWifiSecurity';
      security.setAttribute('aria-label', 'Wi-Fi security');

      [
        ['WPA', 'WPA/WPA2'],
        ['WEP', 'WEP'],
        ['nopass', 'No password']
      ].forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        security.append(option);
      });

      const passLabel = document.createElement('label');
      passLabel.htmlFor = 'qrWifiPassword';
      passLabel.textContent = 'Wi-Fi password';

      const password = document.createElement('input');
      password.id = 'qrWifiPassword';
      password.type = 'password';
      password.placeholder = 'Wi-Fi password';
      password.autocomplete = 'new-password';

      if (security.value === 'nopass') {
        password.disabled = true;
      }

      security.addEventListener('change', () => {
        password.disabled = security.value === 'nopass';
        if (password.disabled) password.value = '';
      });

      holder.append(security, passLabel, password);
    }

    if (config.hint) {
      const hint = document.createElement('small');
      hint.className = 'qr-preview-note';
      hint.textContent = config.hint;
      holder.append(hint);
    }
  }

  document.querySelectorAll('.qr-type').forEach(button => {
    button.addEventListener('click', () => {
      activeType = button.dataset.qrType;

      document.querySelectorAll('.qr-type').forEach(item => {
        item.setAttribute(
          'aria-pressed',
          String(item === button)
        );
      });

      renderInput();
      resetPreview();

      setStatus('Enter your details and generate your QR code.');
    });
  });

  function resetPreview() {
    generatedCanvas = null;

    output.innerHTML = `
      <div class="qr-placeholder">
        <div class="qr-placeholder-icon">▦</div>
        <strong>Your QR code will appear here</strong>
        <p>Enter your details to get started.</p>
      </div>
    `;

    downloadPng.disabled = true;
    downloadJpg.disabled = true;
  }

  function getPayload() {
    const value = $('qrValue')?.value.trim() || '';

    if (!value) {
      throw new Error('Please enter the required information.');
    }

    if (activeType === 'website') {
      try {
        const url = new URL(value);

        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error();
        }

        return url.href;
      } catch {
        throw new Error(
          'Enter a valid URL starting with http:// or https://.'
        );
      }
    }

    if (activeType === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        throw new Error('Enter a valid email address.');
      }

      return 'mailto:' + value;
    }

    if (activeType === 'phone') {
      const digits = value.replace(/[\s().-]/g, '');

      if (!/^\+?[0-9]{7,15}$/.test(digits)) {
        throw new Error('Enter a valid phone number.');
      }

      return 'tel:' + digits;
    }

    if (activeType === 'whatsapp') {
      const digits = value.replace(/\D/g, '');

      if (!/^[1-9][0-9]{7,14}$/.test(digits)) {
        throw new Error(
          'Enter the WhatsApp number with country code, e.g. 919876543210.'
        );
      }

      return 'https://wa.me/' + digits;
    }

    if (activeType === 'wifi') {
      const security = $('qrWifiSecurity').value;
      const password = $('qrWifiPassword').value;

      const escapeWifi = text =>
        text.replace(/([\\;,:"])/g, '\\$1');

      return (
        'WIFI:T:' + security +
        ';S:' + escapeWifi(value) +
        ';P:' + escapeWifi(password) +
        ';;'
      );
    }

    return value;
  }

  function generate() {
    try {
      if (!window.QRCode) {
        throw new Error(
          'QR library did not load. Check your internet connection and reload.'
        );
      }

      const text = getPayload();
      const size = Number($('qrSize').value);
      const dark = $('qrForeground').value;
      const light = $('qrBackground').value;

      if (dark.toLowerCase() === light.toLowerCase()) {
        throw new Error(
          'Choose different foreground and background colours.'
        );
      }

      output.replaceChildren();

      const mount = document.createElement('div');
      output.append(mount);

      new QRCode(mount, {
        text,
        width: size,
        height: size,
        colorDark: dark,
        colorLight: light,
        correctLevel: QRCode.CorrectLevel.H
      });

      const canvas = mount.querySelector('canvas');

      if (!canvas) {
        throw new Error(
          'Could not render the QR code in this browser.'
        );
      }

      generatedCanvas = canvas;

      downloadPng.disabled = false;
      downloadJpg.disabled = false;

      setStatus(
        'QR code generated. Scan it with your phone camera to test it.',
        'success'
      );

    } catch (error) {
      generatedCanvas = null;
      downloadPng.disabled = true;
      downloadJpg.disabled = true;

      setStatus(
        error.message || 'Something went wrong.',
        'error'
      );
    }
  }

  function download(mime, filename) {
    if (!generatedCanvas) return;

    generatedCanvas.toBlob(blob => {
      if (!blob) {
        setStatus(
          'Could not prepare the download. Try PNG instead.',
          'error'
        );
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = filename;

      document.body.append(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1500);

    }, mime, mime === 'image/jpeg' ? 0.94 : undefined);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    generate();
  });

  downloadPng.addEventListener('click', () => {
    download('image/png', 'quickkitlab-qr-code.png');
  });

  downloadJpg.addEventListener('click', () => {
    download('image/jpeg', 'quickkitlab-qr-code.jpg');
  });

  $('qrSize').addEventListener('change', () => {
    if (generatedCanvas) generate();
  });

  $('qrForeground').addEventListener('input', () => {
    if (generatedCanvas) generate();
  });

  $('qrBackground').addEventListener('input', () => {
    if (generatedCanvas) generate();
  });

  renderInput();

})();
