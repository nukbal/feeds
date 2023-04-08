import { createSignal } from 'solid-js';
import { appWindow } from '@tauri-apps/api/window';

const [focus, setFocus] = createSignal(false);

appWindow.onFocusChanged(({ payload }) => {
  setFocus(payload);
});

export default focus;
