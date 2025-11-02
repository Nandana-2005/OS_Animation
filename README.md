Round Robin CPU Scheduling Visualizer

A **web-based interactive animation tool** that visualizes the Round Robin CPU scheduling algorithm in real time.  
Built entirely with **HTML5, CSS3, and JavaScript (ES6)**, this tool runs directly in any modern browser without any installation or server setup.


## Features

- **Interactive Process Input:** Add processes dynamically through input prompts.  
- **Live Scheduling Visualization:** Observe the execution of processes step by step on a canvas.  
- **Dynamic Statistics Dashboard:** Real-time updates of CPU utilization, average waiting time, turnaround time, and throughput.  
- **Queue and Progress Visualization:** Displays process execution progress as color-coded bars.  
- **Full Offline Functionality:** No external libraries or backend dependencies required.

## Technology Stack

| Component | Technology |
|------------|-------------|
| Structure | HTML5 |
| Styling | CSS3 |
| Logic / Animation | JavaScript (ES6) |
| Rendering | HTML5 Canvas API |
| Deployment | Standalone (client-side only) |

---

##  Modular Code Architecture

The project follows a **modular client-side structure**:

 `index.html` = Contains UI layout, control buttons, process table, and canvas element. 
 `style.css`  = Handles dark dashboard design, responsive layout, and color-coded metrics. 
 `script.js` = Implements all logic — process creation, Round Robin scheduling algorithm, animation updates, and metric calculations.



##  Educational Purpose

This simulator helps users understand:
- How Round Robin scheduling distributes CPU time evenly.
- The effect of different **quantum values** on performance.
- How metrics like waiting time and turnaround time are derived in real time.

