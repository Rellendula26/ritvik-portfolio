---
title: "Vend-A-Shoe"
slug: "vend-a-shoe"
category: "embedded"
status: "iterating"
date: "2026"
buildStage: "Cloud-to-hardware prototype running; calibration and reliability iteration"
featured: false
signal: "Embedded + Systems"
tags: "embedded,fullstack,iot,systems,intake"
---

# Vend-A-Shoe Intake

## Summary
- Remote vending controller that lets a user pick a bin in a Next.js dashboard and trigger a physical dispense through a Supabase command queue and Raspberry Pi worker.

## GitHub
- https://github.com/Rellendula26/vend-a-shoe

## Demo
- Local hardware demo; browser action -> queued command -> motor actuation.

## Google Drive Folder
- https://drive.google.com/drive/folders/1bjVGjv9jKeJ5vQp3C1figbPR06-EoTDd?usp=sharing

## What I built
- A cyber-physical vending pipeline instead of a dashboard-only app.
- Frontend writes `device_commands` rows to Supabase with bin-specific actions (`dispense_bin_1..4`).
- Raspberry Pi worker claims pending commands, executes servo movement script, then marks command status.
- Servo control supports per-bin calibration; Bin 3 needed reduced duty cycle to prevent over-rotation.

## Tech stack
- Next.js
- TypeScript
- Supabase
- PostgreSQL
- Raspberry Pi 4
- Python
- RPi.GPIO
- systemd

## Key media
- Browser bin-selection UI on desktop and mobile.
- Physical dispense clips for each bin.
- Wiring and power setup for servo + Pi control.

## Build process
- Milestone 1: single-bin command flow (`dispense`) from web app to Pi script.
- Milestone 2: upgraded to four-bin routing with GPIO mapping in `pi_worker.py`.
- Milestone 3: calibrated Bin 3 with per-bin target duty override after over-travel.
- Milestone 4: UI pass for responsive bin cards, status badges, and clearer loading/command feedback.

## Architecture
- Frontend (`app/page.tsx`): creates queue command rows in Supabase.
- Queue table (`supabase.sql`): tracks `pending`, `running`, `completed`, `failed`; indexed by status/date.
- Worker (`pi_worker.py`): polls oldest pending command, claims atomically via status update, executes servo script, persists outcome.
- Actuation (`servo_motor.py`): PWM sweep from home to target duty and back; target can vary by bin.
- Runtime (`pi-worker.service`): persistent process with restart policy and env-based config.

## Bugs / debugging
- Bin 3 over-rotated and caused unreliable dispense movement.
- Root cause: one motion profile across all bins ignored mechanical variation.
- Fix: added `BIN_TO_TARGET_DUTY` in worker; passed `--target-duty` into servo script for per-bin tuning.
- Another issue: command model started single-lane; this broke scaling to multiple bins.
- Fix: switched action parsing to `dispense_bin_n` and mapped bins to dedicated GPIO pins.

## Technical highlights
- Queue-based cloud-to-hardware architecture avoids exposing Pi directly to internet.
- Command claiming flow reduces duplicate execution risk under polling.
- Status lifecycle gives observability and post-failure diagnosis.
- Includes deployment/runtime details; not just code that runs in dev.

## Technical challenges
- Reliable internet-triggered actuation with safe state transitions.
- Servo power and motion tuning under real mechanical constraints.
- Keeping remote command UX clear while hardware work happens asynchronously.

## What changed from first version to final version
- Initial approach: single `dispense` action and one motor profile.
- Iterated architecture: four-bin action routing + worker-side action parser.
- Iterated hardware logic: per-bin duty-cycle override for non-uniform mechanics.
- Iterated UI: from simple control button to responsive, status-rich multi-bin dashboard.

## Lessons learned
- Physical systems punish "one size fits all" assumptions quickly.
- Queue states matter; `running`/`failed` are not optional if you want to debug real hardware behavior.
- Calibration hooks in software save time when mechanical behavior shifts.

## Final outcome
- Current prototype supports browser-triggered, bin-specific dispense commands with observable queue states and Pi-based execution; it is a working cloud-to-hardware control loop with clear next steps around auth hardening, sensor feedback, and push updates.
