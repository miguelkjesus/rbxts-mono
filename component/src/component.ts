const {
  PreRender,
  PreSimulation,
  PreAnimation,
  PostSimulation
} = game.GetService("RunService")

export abstract class Component<T extends RBXObject = RBXObject> {
  readonly Instance: T;
  protected readonly Connections: RBXScriptConnection[] = [];

  constructor(instance: T) {
    this.Instance = instance;

    this.OnStart?.();

    if ("OnDestroy" in this && this.Instance.IsA("Instance")) {
      this.Connections.push(
        this.Instance.Destroying.Connect(() => this.OnDestroy?.())
      )
    }

    if ("OnPreRender" in this) {
      this.Connections.push(
        PreRender.Connect((dt) => this.OnPreRender?.(dt))
      );
    }

    if ("OnPreSimulation" in this) {
      this.Connections.push(
        PreSimulation.Connect((dt) => this.OnPreSimulation?.(dt))
      );
    }

    if ("OnPreAnimation" in this) {
      this.Connections.push(
        PreAnimation.Connect((dt) => this.OnPreAnimation?.(dt))
      );
    }

    if ("OnPostSimulation" in this) {
      this.Connections.push(
        PostSimulation.Connect((dt) => this.OnPostSimulation?.(dt))
      );
    }
  }

  Destroy() {
    this.OnDestroy?.();
    this.Connections.forEach((conn) => conn.Disconnect());
  }
  
  protected OnStart?(): void;
  protected OnDestroy?(): void;
  protected OnPreRender?(deltaTimeRender: number): void;
  protected OnPreSimulation?(deltaTimeSim: number): void;
  protected OnPreAnimation?(deltaTimeSim: number): void;
  protected OnPostSimulation?(deltaTimeSim: number): void;
}
