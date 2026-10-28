import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce (Unit Tests)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('debe retornar inmediatamente el valor inicial en el primer render', () => {
    const { result } = renderHook(() => useDebounce('iphone', 300));

    expect(result.current).toBe('iphone');
  });

  it('no debe actualizar el valor antes de que transcurra el tiempo de delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'iphone', delay: 300 },
      },
    );

    rerender({ value: 'iphone 15', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('iphone');
  });

  it('debe actualizar el valor debounced una vez cumplido el tiempo exacto', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'sony', delay: 300 },
      },
    );

    rerender({ value: 'sony wh-1000xm5', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('sony wh-1000xm5');
  });

  it('debe reiniciar el temporizador y descartar valores intermedios si el usuario teclea rápido', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'n', delay: 300 },
      },
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'ni', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'nin', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'nintendo', delay: 300 });

    expect(result.current).toBe('n');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('nintendo');
  });

  it('debe utilizar el delay por defecto de 300ms si no se especifica', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      {
        initialProps: { value: 'inicial' },
      },
    );

    rerender({ value: 'modificado' });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('inicial');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('modificado');
  });

  it('debe limpiar el temporizador activo al desmontar el hook y no actualizar el estado tras el unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      {
        initialProps: { value: 'inicial' },
      },
    );

    rerender({ value: 'cambio-pendiente' });
    expect(result.current).toBe('inicial');

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('inicial');
  });

  it('debe preservar la identidad referencial con tipos no primitivos como objetos', () => {
    const initialObj = { query: 'test', count: 1 };
    const updatedObj = { query: 'test2', count: 2 };
    const { result, rerender } = renderHook(
      ({ val }) => useDebounce(val, 300),
      {
        initialProps: { val: initialObj },
      },
    );

    expect(result.current).toBe(initialObj);

    rerender({ val: updatedObj });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe(updatedObj);
  });

  it('debe manejar delay de 0ms actualizando el valor tras avanzar 0ms', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'inicio', delay: 0 },
      },
    );

    rerender({ value: 'inmediato', delay: 0 });
    expect(result.current).toBe('inicio');

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('inmediato');
  });

  it('debe sanear delays negativos tratándolos como 0ms mediante Math.max(0, delay)', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'inicio', delay: -150 },
      },
    );

    rerender({ value: 'saneado', delay: -150 });
    expect(result.current).toBe('inicio');

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('saneado');
  });

  it('debe reiniciar el temporizador adecuadamente si la propiedad delay cambia mientras hay una actualización en espera', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'v1', delay: 300 },
      },
    );

    rerender({ value: 'v2', delay: 300 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Cambiar delay a 500ms: el temporizador debe reiniciarse
    rerender({ value: 'v2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(150);
    });
    // Han pasado 350ms en total desde la solicitud de 'v2', pero con el nuevo delay de 500ms aún no debe cambiar
    expect(result.current).toBe('v1');

    act(() => {
      vi.advanceTimersByTime(350);
    });
    // Ahora se completaron los 500ms tras el cambio de delay
    expect(result.current).toBe('v2');
  });

  it('no debe reiniciar el temporizador si el componente padre se re-renderiza con el mismo valor y delay', () => {
    const { result, rerender } = renderHook(
      (props: { value: string; delay: number; extra?: number }) =>
        useDebounce(props.value, props.delay),
      {
        initialProps: { value: 'inicial', delay: 300, extra: 1 },
      },
    );

    rerender({ value: 'nuevo', delay: 300, extra: 1 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Re-render con idéntico value y delay pero cambio en otra prop del padre
    rerender({ value: 'nuevo', delay: 300, extra: 2 });

    // Si no se reinició el temporizador, tras avanzar los 100ms restantes debe actualizarse
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('nuevo');
  });

  it.each([
    { initial: 'texto', updated: '' },
    { initial: 100, updated: 0 },
    { initial: true, updated: false },
    { initial: 'existe', updated: null },
    { initial: 'definido', updated: undefined },
  ])('debe manejar correctamente valores falsy ($updated)', ({ initial, updated }) => {
    const { result, rerender } = renderHook(
      ({ val }) => useDebounce(val, 200),
      {
        initialProps: { val: initial as unknown },
      },
    );

    expect(result.current).toBe(initial);

    rerender({ val: updated });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(updated);
  });
});
