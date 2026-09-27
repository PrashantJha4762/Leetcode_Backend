import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType = {
    correlationId: string;
};

// AsyncLocalStorage instance to propagate correlation ID across async operations
export const asynclocalstorage = new AsyncLocalStorage<AsyncLocalStorageType>();

export const getcorrelationId = (): string => {
    const asyncStore = asynclocalstorage.getStore();
    return asyncStore?.correlationId || "unknown";
};

export const getCorrelationId = getcorrelationId;