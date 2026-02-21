// LocalStorage persistence service with debounced auto-save
const STORAGE_PREFIX = 'koha_';

export const StorageService = {
    save<T>(key: string, data: T): void {
        try {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
        } catch (e) {
            console.warn('StorageService: Failed to save', key, e);
        }
    },

    load<T>(key: string, fallback: T): T {
        try {
            const raw = localStorage.getItem(STORAGE_PREFIX + key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },

    remove(key: string): void {
        localStorage.removeItem(STORAGE_PREFIX + key);
    },

    clear(): void {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k?.startsWith(STORAGE_PREFIX)) keysToRemove.push(k);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
    },

    /** Export all library data as a JSON blob */
    exportAll(): string {
        const data: Record<string, unknown> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k?.startsWith(STORAGE_PREFIX)) {
                data[k.replace(STORAGE_PREFIX, '')] = JSON.parse(localStorage.getItem(k)!);
            }
        }
        return JSON.stringify(data, null, 2);
    },

    /** Import data from a JSON blob */
    importAll(json: string): void {
        const data = JSON.parse(json) as Record<string, unknown>;
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
        });
    },
};

/** Debounced saver — call frequently, saves after 300ms idle */
export function createDebouncedSaver(key: string, delay = 300) {
    let timer: ReturnType<typeof setTimeout>;
    return <T>(data: T) => {
        clearTimeout(timer);
        timer = setTimeout(() => StorageService.save(key, data), delay);
    };
}
