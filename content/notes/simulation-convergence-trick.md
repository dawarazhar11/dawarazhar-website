---
title: "Convergence Trick: Gradual Relaxation"
publishDate: "2025-08-12T11:20:00+05:00"
description: "Getting stubborn simulations to converge"
---

Working on a tricky multiphase flow that kept diverging after 500 iterations. Instead of tweaking the mesh again, tried gradually reducing under-relaxation factors:

- Start: Pressure 0.8, Velocity 0.7
- Mid: Pressure 0.5, Velocity 0.5  
- Final: Pressure 0.3, Velocity 0.3

Simulation converged beautifully! Sometimes patience beats brute force. The physics doesn't care about our deadlines. 🕐

Pro tip: Monitor residuals AND physical quantities. Residuals can lie, but mass flow rates don't.