import { Subject } from 'rxjs';

interface Options {
  idleTimeout?: number;
}

export class BackpressureSubject<T> extends Subject<T> {
  private readonly idleTimeout: number;

  constructor(options?: Options) {
    super();

    this.idleTimeout = options?.idleTimeout ?? 250;
  }

  // Mutable
  private $store: T[];

  private $next = () => {
    if (!this.$store.length) {
      this.complete();

      return this;
    }

    // Mutates
    this.next(this.$store.shift() as T);

    return this;
  };

  idle() {
    setTimeout(this.$next, this.idleTimeout);

    return this;
  }

  setStore = (data: T[]) => {
    // shallow copy to not mutate the argument directly
    this.$store = [...data];
    this.idle();

    return this;
  };
}
