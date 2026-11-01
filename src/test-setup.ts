import * as bootstrap from 'bootstrap';
import { vi } from 'vitest';
Object.assign(globalThis, { bootstrap });
Object.assign(window, { bootstrap });
window.scrollTo = vi.fn();
