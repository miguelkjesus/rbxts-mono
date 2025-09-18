import { Cleaner } from 'cleaner'

export abstract class Component {
  readonly Instance: RBXObject

  private readonly DestroyingEvent: BindableEvent<() => void> = new Instance(
    'BindableEvent'
  )
  readonly Destroying = this.DestroyingEvent.Event

  private readonly StartingEvent: BindableEvent<() => void> = new Instance(
    'BindableEvent'
  )
  readonly Starting = this.StartingEvent.Event

  protected readonly DestroyTasks = new Cleaner()

  constructor(instance: RBXObject) {
    this.Instance = instance

    this.StartingEvent.Fire()
    this.OnStart?.()

    if (this.Instance.IsA('Instance')) {
      this.DestroyTasks.Add(
        this.Instance.Destroying.Connect(() => this.Destroy())
      )
    }
  }

  static IsClass(instance: RBXObject): instance is RBXObject {
    return instance.IsA('Object')
  }

  Destroy() {
    this.DestroyingEvent.Fire()
    this.OnDestroying?.()
    this.DestroyTasks.CleanAll()
  }

  protected OnStart?(): void
  protected OnDestroying?(): void
}

export type ComponentInstance<T> = T extends Component ? T['Instance'] : never

export class NonAbstractComponent extends Component {
  constructor(instance: RBXObject) {
    super(instance)
    error(
      'Do not inherit from or create this class. Please use Component instead.'
    )
  }
}

export type ComponentPropsKeys<T> = Extract<
  WritablePropertyNames<T>,
  string | number | symbol
>

export type ComponentProps<T> = {
  [K in ComponentPropsKeys<T>]?: T[K]
}
