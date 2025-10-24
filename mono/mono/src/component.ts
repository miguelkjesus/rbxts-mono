import { event } from 'internal/event-utils'
import { Cleaner } from 'utils/cleaner'

export abstract class Component {
  readonly Instance: RBXObject

  private readonly AwakingEvent = event<[]>()
  readonly Awaking = this.AwakingEvent.Event

  private readonly StartingEvent = event<[]>()
  readonly Starting = this.StartingEvent.Event

  private readonly DestroyingEvent = event<[]>()
  readonly Destroying = this.DestroyingEvent.Event

  protected readonly DestroyTasks = new Cleaner()

  constructor(instance: RBXObject) {
    this.Instance = instance

    this.AwakingEvent.Fire()
    this.OnAwake?.()

    task.defer(() => {
      this.StartingEvent.Fire()
      this.OnStart?.()
    })

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
    this.OnDestroy?.()
    this.DestroyTasks.CleanAll()
  }

  /**
   * Fires before any other event methods are bound.
   *
   * Ideal place to perform any component initialisation.
   */
  protected OnAwake?(): void

  /**
   * Fires the frame after a component is created.
   */
  protected OnStart?(): void

  /**
   * Fires whenever the component is destroyed.
   */
  protected OnDestroy?(): void
}

export type ComponentInstance<T> = T extends Component ? T['Instance'] : never

export class NonAbstractComponent extends Component {
  constructor(instance: RBXObject) {
    super(instance)
    error(
      'Do not inherit from or create NonAbstractComponent. Please use Component instead.'
    )
  }
}

export type ComponentProps<T> = T extends Component
  ? Partial<WritableProperties<T>>
  : never
