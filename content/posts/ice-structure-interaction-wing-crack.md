---
title: "Understanding Ice-Structure Interaction: FEM Simulation o..."
description: "The relentless force of drifting ice jeopardizes the structural integrity of installations like offshore wind turbines, oil platforms, and bridges. Wh"
publishDate: 2024-06-05
tags: ["engineering", "finite-element-analysis-fea", "mechanical-engineering", "computational-mechanics", "fem", "finite-element-method", "fracture-mechanics", "ice-loads", "ice-structure-interaction", "simulation", "structural-analysis", "wing-crack-model"]
---

The relentless force of drifting ice jeopardizes the structural integrity of installations like offshore wind turbines, oil platforms, and bridges. When shifting ice meets a structure, intense pressure builds up at certain points, known as high-pressure zones (HPZ). These zones can inflict substantial damage, making ice-structure interaction a critical concern for engineers. The Wing-Crack Model provides a valuable tool for understanding and mitigating the risks involved.

## **Wing-Crack Model: Simulating Ice Failure**

The Wing-Crack Model excels in simulating the complex process of ice crushing against a compliant vertical structure. Unlike simpler models, it realistically accounts for how cracks initiate and spread within the ice. This three-dimensional model draws on the principles of continuum mechanics, offering a detailed mathematical view of how ice behaves under stress. This type of analysis is helpful especially for vessels design which have to interact with ice continuously.

*[Image: An image of cracked ice when a ship is on top, with the crack in focus near the hull]*

An image of cracked ice when a ship is on top, with the crack in focus near the hull

To bring this model to life, researchers utilize Abaqus/Explicit FE software, a powerful tool for analyzing physical problems with complex mechanical behavior. A key aspect of the simulation is the element erosion technique. This method simulates the ice breaking apart realistically; as elements (sections) of the ice model become completely damaged, they are removed, visually representing the crushing effect.

## **A Real-World Case Study**

To illustrate the Wing-Crack Model's capabilities, let's consider a specific simulation scenario:

*   **Ice Conditions:** A sheet of ice 48 cm thick drifts at a velocity of 30 cm/s. This represents a realistic threat in many parts of the world.
*   **Structure:** A vertical cylindrical structure with a diameter of 2.0 meters stands in the ice's path.

By analyzing this simulation, engineers gain a detailed understanding of how HPZs develop around the structure. The model reveals the precise distribution of crushing forces, allowing engineers to identify where the structural load is highest. Armed with this knowledge, they can make informed decisions about structural design to withstand the powerful forces of ice.

## **Building on a Strong Foundation**

The development of the Wing-Crack Model rests on the groundbreaking research by Kolari (2017), who established a comprehensive theoretical basis for simulating crack growth in brittle solids like ice. The advancement of this model was further driven by several research projects:

*   **[DICE](https://www.aka.fi/en/):** Funded by the Academy of Finland
*   **ARNOR:** Funded by [Tekes](https://fundit.fr/en/institutions/finnish-funding-agency-innovation-tekes) – the Finnish Funding Agency for Innovation and industry partners (Aker Arctic, Fennovoima, TraFi)
*   **COME:** Funded by [VTT Technical Research Centre of Finland](https://www.vttresearch.com/)

## **The Value of Simulation**

The Wing-Crack Model, coupled with FEM simulations, highlights the immense value of numerical modeling in engineering. It allows engineers to go beyond theoretical calculations and witness how structures might react under real-world ice conditions. This aids in designing safer and more resilient offshore infrastructure. While models are continuously being refined, this simulation technique represents a major stride in protecting structures operating in the world's coldest regions.