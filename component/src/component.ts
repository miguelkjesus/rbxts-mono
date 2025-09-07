import { Maid } from "maid";

export abstract class Component {
  readonly Instance: RBXObject;

  private readonly DestroyingEvent: BindableEvent<() => void> = new Instance("BindableEvent")
  readonly Destroying = this.DestroyingEvent.Event

  readonly Maid = new Maid()

  constructor(instance: RBXObject) {
    this.Instance = instance;

    this.OnStart?.();

    if (this.Instance.IsA("Instance")) {
      this.Maid.Add(this.Instance.Destroying.Connect(() => this.Destroy()))
    }
  }

  static IsClass(instance: RBXObject): instance is RBXObject {
    return instance.IsA("Object")
  }

  Destroy() {
    this.OnDestroying?.();
    this.DestroyingEvent.Fire()
    this.Maid.Clean();
  }
  
  protected OnStart?(): void;
  protected OnDestroying?(): void;
}

export type ComponentInstance<T> = T extends Component ? T["Instance"] : never

export class NonAbstractComponent extends Component {
  constructor(instance: RBXObject) {
    super(instance)
    error("Do not inherit from or create this class. Please use Component instead.")
  }
}
