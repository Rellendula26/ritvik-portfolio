---
title: "Vend-A-Shoe"
slug: "vend-a-shoe"
category: "embedded"
status: "shipped"
date: "Summer 2026"
buildStage: "Client Deployment"
featured: true
signal: "Electromechanical Systems"
disciplines: "Mechanical Design, Electrical Integration, Embedded Systems, Cloud Software"
tags: "Raspberry Pi 4, Python, Next.js, Supabase, MG996R, Onshape, GPIO, PWM, USB-C PD, LEDs, fan, multimeter, systemd"
---

# Vend-A-Shoe Intake

## Summary
- Designed, fabricated, and shipped a client-facing electromechanical dispensing system integrating custom mechanical design, embedded control, electrical integration, and cloud connectivity.

## GitHub
- https://github.com/Rellendula26/vend-a-shoe-backend

## Demo
- https://vend-a-shoe.vercel.app/

## Google Drive Folder
- https://drive.google.com/drive/folders/1vmhLtJWbZPy66M_R9-7Bo1iLIvf3NcxG?usp=sharing

## What I built
During my internship at BrainChild Engineering, I developed Vend-A-Shoe for a client deployment. The work meant designing a custom mechanical enclosure; integrating electrical distribution for 4 MG996R servos, 8 LED indicators, and a cooling fan across 40+ wire interconnects; writing embedded control on a Raspberry Pi; and connecting that stack to an existing frontend through a cloud command pipeline. The hardest part was not any single subsystem; it was integrating them. Packaging moved the harness; electrical changes moved the enclosure; software had to absorb real manufacturing tolerances.

## Technical highlights
- Designed a custom enclosure with 3D-printed fixtures and laser-cut panels for manufacturable assembly
- Integrated 4 MG996R servos, 8 LEDs, and a fan through a centralized power-distribution architecture with Raspberry Pi GPIO control
- Merged a new backend with an existing production frontend for remote cloud-triggered dispensing

## Tech stack
- Raspberry Pi 4
- Python
- RPi.GPIO
- MG996R
- LEDs
- Cooling fan
- Next.js
- TypeScript
- Supabase
- Onshape
- systemd
- USB-C PD
- Bench PSU
- Multimeter

## Key media
- Hero: videos/seconddemo.mp4
- Cover still: images/coverCAD.jpg

## Architecture
- Dashboard inserts bin commands into Supabase.
- Pi worker claims, actuates, writes completed or failed.
- Protoboard distributes servo, LED, and fan power with a common ground.

## Technical challenges
- Fitting 4 servos, 8 LEDs, a fan, harness, Pi, and power in a serviceable volume.
- Keeping actuator and accessory current off the Pi rail.
- LED and fan harness lengths that were never the same twice; 40+ wires to route and service.
- Deciding whether a quiet channel was wiring, software, or dead hardware without guessing.
- Hooking a new backend into a frontend that already existed.

## Lessons learned
- The biggest skill was debugging across systems, not inside any one of them.
- Power supply and multimeter measurements beat intuition when rails sag and grounds float.
- Breadboard success does not survive transport.
- Packaging and power decide whether the software loop looks correct in the field.

## Final outcome
- Working unit shipped to the client after breadboard bring-up, protoboard permanence, wall power, and multi-bin calibration.
