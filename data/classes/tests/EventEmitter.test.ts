import {EventEmitter as _EventEmitter} from '../EventEmitter';
import type {Static} from '@micra/core/utilities/Static';

declare global {
  namespace Application {
    interface Events {
      event: number;
    }
  }
}

const EventEmitter = _EventEmitter as unknown as Static<
  Micra.EventEmitter<Application.Events> & {
    _events: Partial<{[K: string]: ((payload: unknown) => void)[]}>;
  }
>;

describe('EventEmitter tests', () => {
  it('should add a listener of a given event', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter();

    eventEmitter.on('event', listener);

    expect(eventEmitter._events).toEqual({event: [listener]});
  });

  it('should add multiple listeners of a given event', async () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const eventEmitter = new EventEmitter();

    eventEmitter.on('event', listener1);
    eventEmitter.on('event', listener2);

    expect(eventEmitter._events).toEqual({event: [listener1, listener2]});
  });

  it('should call a listener of a given event asynchronously', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('event', listener);

    await eventEmitter.emit('event', 42);

    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should call a listener of a given event synchronously', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter();
    eventEmitter.on('event', listener);

    eventEmitter.emitSync('event', 42);

    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should remove a listener of a given event', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter();
    const unsubscribe = eventEmitter.on('event', listener);

    unsubscribe();
    eventEmitter.emitSync('event', 42);

    expect(listener).not.toHaveBeenCalled();
  });
});
