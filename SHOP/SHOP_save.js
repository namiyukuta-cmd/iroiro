(() => {
  'use strict';

  const CLOUD = {
    owner: 'namiyukuta-cmd',
    repo: 'private-game-data',
    path: 'shop/save.json'
  };

  // トークンはページを開いている間のメモリにだけ保持する。
  // localStorage / sessionStorage / IndexedDB / Cache Storage は使用しない。
  let tokenInMemory = '';

  function cleanToken(value) {
    return String(value || '').replace(/\s+/g, '');
  }

  async function requireToken() {
    if (tokenInMemory) return tokenInMemory;

    const value = prompt('private-game-data を使うGitHubトークンを入力してください');
    if (!value) throw new Error('中止しました');

    tokenInMemory = cleanToken(value);
    return tokenInMemory;
  }

  function apiUrl() {
    return 'https://api.github.com/repos/' +
      encodeURIComponent(CLOUD.owner) + '/' +
      encodeURIComponent(CLOUD.repo) +
      '/contents/' +
      CLOUD.path.split('/').map(encodeURIComponent).join('/');
  }

  function headers(token) {
    return {
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28'
    };
  }

  function encode64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  function decode64(text) {
    const raw = atob(String(text || '').replace(/\s/g, ''));
    const bytes = Uint8Array.from(raw, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  async function readFile(token) {
    const response = await fetch(apiUrl(), {
      method: 'GET',
      headers: headers(token),
      cache: 'no-store'
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error('private-game-data を読み込めませんでした (' + response.status + ')');
    }

    const file = await response.json();
    return {
      sha: file.sha || '',
      data: JSON.parse(decode64(file.content))
    };
  }

  async function load() {
    const token = await requireToken();
    const file = await readFile(token);
    if (!file) throw new Error('セーブデータがありません');
    return file.data;
  }

  async function save(state) {
    const token = await requireToken();
    const existing = await readFile(token);

    const snapshot = JSON.parse(JSON.stringify(state || {}));
    snapshot.savedAt = new Date().toISOString();

    const body = {
      message: 'Update SHOP save',
      content: encode64(JSON.stringify(snapshot, null, 2))
    };

    if (existing && existing.sha) body.sha = existing.sha;

    const response = await fetch(apiUrl(), {
      method: 'PUT',
      headers: Object.assign(
        {'Content-Type': 'application/json'},
        headers(token)
      ),
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('private-game-data へ保存できませんでした (' + response.status + ')');
    }

    return snapshot;
  }

  window.SHOP_SAVE = Object.freeze({
    save,
    load
  });
})();
