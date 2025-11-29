---
title: "Building Brighter Displays: Modular Magnetic LED Matrix w..."
description: "If you're into electronics, you've likely come across \bitluni\ and their fascination with soldering endless arrays of LEDs. Fortunately for us, this "
publishDate: 2024-10-15
tags: ["engineering", "tech", "addressable-leds", "arduino", "bitluni", "diy-electronics", "led-matrix", "led-projects", "magnetic-connectors", "modular-display", "soldering", "ws2812d"]
---

If you're into electronics, you've likely come across \[bitluni\] and their fascination with soldering endless arrays of LEDs. Fortunately for us, this obsession leads to some seriously eye-catching displays. The latest creation? A Modular Magnetic LED Matrix using 8 mm [WS2812D-F8](https://www.youtube.com/watch?v=L2J_eNgjxio) addressable LEDs—making the electronics simpler and the displays even brighter.

Source: HACKADAY

In the previous version, \[bitluni\] used standard 8×8 LED panels, but these required multiplexing, which limited their brightness and needed a more complex driver circuit. This time around, they’ve taken a different approach with the ATtiny running the MegaTinyCore Arduino core to control the panels. The standout feature? [Magnetic four-pin connectors](https://hackaday.com/2018/11/15/magnets-and-printed-parts-make-quick-disconnect-terminals/) that let the panels snap together effortlessly. While they perform well, they’re hilariously tricky to solder since they keep pulling the soldering iron towards them!

To keep things portable, \[bitluni\] designed a basic battery module and even 3D printed tidy enclosures to hold everything together. One of the more innovative ideas they toyed with was creating staggered holes for through-hole LEDs, allowing them to be plugged in without soldering—a huge plus for anyone who’s faced the nightmare of fixing faulty LEDs on large [walls](https://hackaday.com/2019/08/29/giant-led-display-is-1200-balls-to-the-wall/). However, the long leads caused shorting issues, and soldering was the only reliable solution in the end. Still, the potential of this pluggable design is something worth refining in future builds.

The final result is a clean, modular display system that snaps together seamlessly. Plus, \[bitluni\] added a simple animation program that updates automatically when panels are added or removed. It’s a fun and flexible way to create customizable LED displays. What would you build with this setup? Share your ideas in the comments!

https://youtu.be/L2J\_eNgjxio