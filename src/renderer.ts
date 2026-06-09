import './index.css';

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);

const banner = document.getElementById('update-banner') as HTMLDivElement;
const message = document.getElementById('update-message') as HTMLSpanElement;
const installBtn = document.getElementById('install-update-btn') as HTMLButtonElement;
const dismissBtn = document.getElementById('dismiss-banner-btn') as HTMLButtonElement;

function showBanner(text: string, showInstall: boolean, isError = false) {
  message.textContent = text;
  banner.style.display = 'flex';
  banner.classList.toggle('error', isError);
  installBtn.style.display = showInstall ? 'inline-block' : 'none';
}

function hideBanner() {
  banner.style.display = 'none';
  banner.classList.remove('error');
}

installBtn.addEventListener('click', () => {
  window.electronAPI.installUpdate();
});

dismissBtn.addEventListener('click', hideBanner);

window.electronAPI.onUpdateStatus((data) => {
  switch (data.status) {
    case 'available':
      showBanner('正在下载更新…', false);
      break;
    case 'progress':
      showBanner(`正在下载更新 ${data.percent ?? 0}%`, false);
      break;
    case 'ready':
      showBanner('新版本已就绪，点击重启安装', true);
      break;
    case 'error':
      showBanner('更新下载失败，请稍后重试', false, true);
      setTimeout(hideBanner, 5000);
      break;
  }
});
