# PROJECT_ANALYSIS

## Project overview
- An autonomous cyber-physical vending platform that bridges cloud infrastructure with real-world hardware. Vend-A-Shoe enables users to remotely dispense physical inventory through a web application by orchestrating a distributed system spanning cloud databases, embedded controllers, mechanical actuation, and real-time hardware execution. Built during my Hardware Engineering Internship at BrainChild Engineering, this project explores how modern software infrastructure can reliably interact with physical devices through secure, scalable IoT architectures. --- Most web applications terminate at a screen. Vend-A-Shoe extends software into the physical world. A user can remotely interact with a deployed web application to trigger real-world hardware actions. Commands are transmitted through a cloud-hosted control layer, processed by an embedded Raspberry Pi worker, and executed through electromechanical hardware including high-torque servo motors and GPIO peripherals. The result is a complete cloud-to-hardware pipeline capable of controlling physical devices from anywhere with internet access. ---
- Goal: remote cloud command submission that triggers physical vending hardware.

## Repository evidence
- Repo URL: https://github.com/Rellendula26/vend-a-shoe
- Default branch: main
- Approximate commit count: 13
- Last active date: 2026-06-23

## Technical stack (specific)
### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide icons

### Backend / Infrastructure
- Supabase JS client
- Supabase Postgres schema + policies
- Vercel deploy config
- Command queue worker polling

### Hardware / Embedded (if applicable)
- Raspberry Pi Python worker
- RPi.GPIO PWM servo control
- MG996R servo integration
- Raspberry Pi 4 target

## Architecture
- UI writes command rows into `device_commands` through Supabase client.
- Pi worker polls oldest `pending` command, claims atomically by status transition, executes servo script, then marks `completed` or `failed`.
- `supabase.sql` defines queue table, status indexes, and permissive MVP RLS policies for select/insert/update.
- Servo script performs PWM sweep from home duty to target duty and returns home; supports per-bin duty overrides.
- Systemd unit keeps worker process alive on boot with restart semantics and environment-based credentials.

## Major components
- `app/page.tsx`: command UI and Supabase insert flow for bin-specific dispense actions.
- `pi_worker.py`: queue consumer loop, command claiming, action parsing, command status updates.
- `servo_motor.py`: GPIO PWM motor sweep with safe return to home duty cycle.
- `supabase.sql`: command queue table, indexes, RLS policies for MVP access model.
- `pi-worker.service`: Linux service definition for persistent worker execution.

## Engineering decisions
- Decision: queue-based cloud-to-device architecture through Supabase
  - Why: avoids exposing Raspberry Pi directly to internet; keeps command history durable.
  - Tradeoff: introduces polling delay and status reconciliation complexity.
- Decision: status transitions (`pending`, `running`, `completed`, `failed`)
  - Why: gives observability and recovery semantics for physical actions.
  - Tradeoff: requires extra state management in worker and UI.
- Decision: per-bin GPIO mapping + optional per-bin duty-cycle override
  - Why: bins have different mechanical behavior; one motion profile was not enough.
  - Tradeoff: calibration overhead increases as hardware lanes grow.

## Debugging stories and iteration
- Bin 3 over-rotation was addressed with per-bin target duty override in worker + servo invocation.
- System evolved from single `dispense` action to `dispense_bin_1..4` command routing with GPIO mapping.
- UI iteration added responsive bin cards and stronger device-state feedback.

## Implementation details worth surfacing
- Worker deployment uses systemd with restart-on-failure and explicit env variables.
- Environment file separates public client keys from worker runtime configuration.
- Frontend run command: `npm run dev`.
- Queue worker claims commands by status to reduce duplicate execution.
- Servo control script sweeps gradually with configurable target duty.
- Schema includes queue-oriented indexes and explicit command lifecycle fields.
- Command lifecycle states are documented and surfaced for observability.

## What makes this non-tutorial
- Cross-domain integration: web UI, queue backend, worker process, and physical servo actuation in one loop.
- Commit history shows calibration and architecture evolution, not just initial scaffolding.
- Includes deployment/runtime concerns via service unit + env management.

## Lessons learned
- Mechanical variance forces software-level calibration hooks.
- State transitions make hardware workflows debuggable when remote.
- Cloud intermediaries simplify security for internet-controlled devices.

## Future improvements
- Add push-based updates instead of pure polling for faster UX.
- Harden RLS and command auth model beyond MVP open policies.
- Add sensor feedback to verify successful dispense actions.

## Final outcome
- Repository demonstrates a working command pipeline from browser action to bin-specific motor actuation with observable status lifecycle.

## Media available in repository
- No obvious media assets were detected in the repository tree.

## Project page recommendations
- Set one clear hero: either a main demo clip or one clean system photo.
- Use diagrams for architecture section; keep screenshots in image gallery.
- Add at least one process photo or clip so iteration is visible.

## Recent commit evidence
- b7ef11f (2026-06-23): Revise README for clarity and detail
- 501e7ad (2026-06-23): Merge pull request #3 from Rellendula26/cursor/four-bin-motor-control
- 5c4edc6 (2026-06-23): Polish responsive bin selection UI and Tailwind theme tokens.
- 9d175db (2026-06-23): Stabilize Next.js layout and generated type config.
- 65b4627 (2026-06-23): Add shared UI primitives and global styles.
- e218b3b (2026-06-23): Add UI tooling and ignore generated Python cache files.
- fd2caaf (2026-06-23): Merge pull request #2 from Rellendula26/cursor/four-bin-motor-control
- f269bfd (2026-06-23): Tune Bin 3 servo travel.
- 653d9f6 (2026-06-23): Merge pull request #1 from Rellendula26/cursor/four-bin-motor-control
- 67e2c5d (2026-06-23): Add four-bin motor control flow.
- 1ab39d0 (2026-06-18): Add project description for BrainChild internship
- 670af33 (2026-06-18): Create README.md
