import { EventEmitter } from '../EventEmitter';

declare global {
  namespace Application {
    interface Events {
      event: number;
    }
  }
}

describe('EventEmitter tests', () => {
  it('should add a listener of a given event', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter<Application.Events>();

    eventEmitter.on('event', listener);

    expect(eventEmitter._events).toEqual({ event: [listener] });
  });

  it('should add multiple listeners of a given event', async () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const eventEmitter = new EventEmitter<Application.Events>();

    eventEmitter.on('event', listener1);
    eventEmitter.on('event', listener2);

    expect(eventEmitter._events).toEqual({ event: [listener1, listener2] });
  });

  it('should call a listener of a given event asynchronously', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter<Application.Events>();
    eventEmitter.on('event', listener);

    await eventEmitter.emit('event', 42);

    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should call a listener of a given event synchronously', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter<Application.Events>();
    eventEmitter.on('event', listener);

    eventEmitter.emitSync('event', 42);

    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should remove a listener of a given event', async () => {
    const listener = vi.fn();
    const eventEmitter = new EventEmitter<Application.Events>();
    const unsubscribe = eventEmitter.on('event', listener);

    unsubscribe();
    eventEmitter.emitSync('event', 42);

    expect(listener).not.toHaveBeenCalled();
  });
});
