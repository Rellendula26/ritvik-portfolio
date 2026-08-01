---
title: "Analog Electromechanical Lightsaber"
slug: "saber"
category: "hardware"
status: "shipped"
date: "Spring 2026"
buildStage: "Shipped Demo"
featured: true
signal: "Electromechanical Systems"
disciplines: "Mechanical Design, Analog Circuit Design, Electrical Integration, Manufacturing, Product Engineering"
tags: "Fusion 360, 3D Printing, NE555, PN2222A, Perfboard, Through-hole Soldering, LED Strip, 9V Power, Oscillator Design"
---

# Analog Electromechanical Lightsaber Intake

## Summary
- Designed and fabricated a handheld electromechanical system integrating custom mechanical packaging, discrete analog electronics, embedded lighting control, and structural design into a durable wearable prototype.

## Demo
- https://youtu.be/iIqSYOqp9UE

## What I built
I built this in Detkin Lab as a handheld system that had to leave the breadboard. The work meant designing a custom Fusion 360 hilt, emitter, and battery carrier across multiple print revisions; integrating a discrete analog audio circuit (NE555 timer, RC network, PN2222A transistor) alongside LED blade illumination on a switched 9V power architecture; and manufacturing the boards with 40+ through-hole joints. The electronics were straightforward; the challenge was packaging them into a handheld device that could survive repeated impact and handling. Blade bending loads broke the hilt twice; cable length forced an LED pad salvage.

## Technical highlights
- Designed a custom Fusion 360 enclosure and iterated hilt CAD/print geometry after two catastrophic impact failures under blade bending loads
- Designed and assembled a discrete analog audio circuit using an NE555 timer, RC timing network, and PN2222A transistor to generate sound alongside LED blade illumination
- Transitioned from breadboard validation to a soldered perfboard assembly with 40+ through-hole joints, improving durability, electrical reliability, and portability

## Tech stack
- Fusion 360
- 3D Printing
- NE555
- PN2222A
- Perfboard
- Through-hole Soldering
- LED Strip
- 9V Power
- Oscillator Design

## Key media
- Hero: /projects/lightsaber/fullsaber-web.mp4
- Cover still: /projects/lightsaber/saberwhite.png
- Analog alone (PSU): /projects/lightsaber/onlyanalogcircuit.mp4
- Analog in saber: /projects/lightsaber/analogcircuit-in-saber.mp4

## Architecture
- 9V through a hilt switch, then split to LED strip and analog audio.
- NE555 astable into RC timing, PN2222A driver, 8Ω speaker.
- Printed hilt, emitter, and battery carrier package the harness under impact loads.

## Technical challenges
- Polycarbonate blade as a lever arm concentrated bending moment at the printed hilt.
- LED strip lead too short after final assembly; no replacement strip available.
- Measured NE555 sweep disagreed with the textbook RC prediction.

## Lessons learned
- The electronics were straightforward; packaging and structural reliability decided the build.
- Failure analysis beats stronger glue when the load path is wrong.
- Salvaging a component under constraint is as much engineering as picking a better part.

## Final outcome
- Working handheld unit with illumination, analog sound, and a redesigned hilt that survived repeated impacts after failure-driven CAD and print changes.
