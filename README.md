# @rbxts/mono

A component library built for and in roblox-ts!

Called **"mono"** since it was initially inspired by MonoBehaviour in Unity :)

## Development Guide

`📁 /mono` Contains **@rbxts/mono** package source code

- `⚙️` Generate components using `npm run codegen`


- `⚙️` Build using `npm run build/watch`

---

`📁 /scripts/codgen` Contains component code generation scripts

- `ℹ️` No need to build this!

---

`📁 /mono-inspector` Contains **MonoInspector** plugin source code

## MVP Tasks
- [ ] Components
  - [x] Custom event methods
  - [x] Basic manipulation methods
  - [ ] (50%) Introduce all lifecycle events
  - [ ] *TBD*
- [ ] Component code generation
  - [x] Classes and inheritance
  - [x] Event methods
  - [x] Fully error-free
  - [ ] (30%) JSDocs
  - [ ] *TBD*
- [ ] Add utilities
  - [x] Cleaner
  - [x] Throttler
  - [ ] *TBD*
- [ ] Make migration-friendly
  - [x] Tag -> component associations
  - [x] Simple attribute -> property associations
  - [ ] Complex attributes -> properties associations
  - [ ] *TBD*
- [ ] MonoInspector plugin
  - [ ] Add component tracking and metadata
  - [ ] Feature plan
  - [ ] Base UI design
  - [ ] *TBD*
