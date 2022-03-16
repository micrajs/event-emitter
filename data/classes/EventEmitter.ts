/// <reference types="@micra/core/event-emitter" />

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export class EventEmitter<E extends Record<string, any> = Record<string, any>>
  implements Micra.EventEmitter<E>
{
  _events: Partial<{[K in keyof E]: ((payload: E[K]) => void)[]}> = {};

  private _callListener<K extends keyof E>(
    event: K,
    payload: E[K],
    listener: (payload: E[K]) => void,
  ) {
    try {
      listener(payload as E[K]);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `EventEmitter: an error occurred while emitting the "${
            event as string
          }" event ${e}`,
        );
      }
    }
  }

  on<K extends keyof E>(
    event: K,
    cb: (payload: E[K]) => void,
  ): Micra.UnsubscribeCallback {
    !this._events[event]
      ? (this._events[event] = [cb])
      : this._events[event]?.push(cb);

    return () => {
      this._events[event] = this._events[event]?.filter((i) => i !== cb);
    };
  }

  async emit<K extends keyof E>(
    ...[event, payload]: Micra.EmitArgs<E, K>
  ): Promise<void> {
    this._events[event]?.forEach((i) =>
      this._callListener(event, payload as E[K], i),
    );
  }

  emitSync<K extends keyof E>(...[event, payload]: Micra.EmitArgs<E, K>): void {
    this._events[event]?.forEach((i) =>
      this._callListener(event, payload as E[K], i),
    );
  }
}
