import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, Math.max(0, delay));

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}