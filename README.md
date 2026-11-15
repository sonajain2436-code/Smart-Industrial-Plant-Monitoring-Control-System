# SMART INDUSTRIAL PLANT MONITORING & CONTROL SYSTEM (SIP-MCS)
> **Electronics Design Academic Capstone & SCADA Automation Suite**
> Integrating Mechanical Engineering, Chemical Engineering, and Electrical Engineering into an unified Cyber-Physical Plant Twin.

---

## 🏭 Project Architecture Overview

The **Smart Industrial Plant Monitoring & Control System (SIP-MCS)** is an interactive, real-time industrial supervision and control software (SCADA) designed for an interdisciplinary Electronics Design demonstration.

The platform simulates a smart manufacturing facility with tight physical coupling across three engineering disciplines:

```
                  +----------------------------------------------+
                  |         ELECTRICAL ENGINEERING (EE)          |
                  |  415V 3-Phase Substation Bus & Transformers  |
                  +----------------------------------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |         MECHANICAL ENGINEERING (ME)          |
                  |  4-Pole Induction Motors & Centrifugal Pumps |
                  +----------------------------------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |         CHEMICAL ENGINEERING (CHE)           |
                  |  CSTR Stirred Reactor & Reagent Mixing Tanks |
                  +----------------------------------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |          FINISHED PRODUCT AUDIT              |
                  |     OEE & Weighted Overall Plant Health      |
                  +----------------------------------------------+
```

---

## 🌟 Key Functional Modules

### 1. 📊 Overview Dashboard
- Real-time operational counters: Total Machines (7), Running (7), Stopped (0), Active Alarms.
- Live telemetry cards with dynamic badges for Motor Speed, Pump Pressure, Reactor Core Temperature, Grid Power Draw (kW), Power Factor, and Cumulative kWh.
- 4 Real-time SCADA trend charts updating every 1.5 seconds.
- Master plant commands: **START PLANT**, **STOP PLANT**, **EMERGENCY STOP (E-STOP)**, and **RESET SYSTEM**.

### 2. ⚙️ Mechanical Engineering Module
- **Induction Motor:** RPM modulation (0–3000 RPM), core stator temperature, ISO 10816 vibration velocity (mm/s RMS), drive end (DE) bearing tribology, and IE3 efficiency modeling.
- **Centrifugal Pumps:** Delivery flow rate (L/min), discharge head pressure (bar), fluid temperature, and hydrodynamic efficiency.
- **Interactive Controls:** VFD speed setpoint slider with presets (0, 750, 1480, 2200, 3000 RPM), start/stop toggles, and dynamic Euler head-capacity curve (H-Q).

### 3. 🧪 Chemical Engineering Module
- **3 Raw Material Storage Tanks:** Tank A (Reagent Alpha - Acid), Tank B (Reagent Beta - Base), and Tank C (Catalyst / Buffer Solution) with animated fluid column levels and replenishment cycles.
- **CSTR Chemical Reactor Vessel:**
  - Jacketed heat exchanger thermodynamics.
  - Temperature setpoint modulation (30°C to 110°C).
  - Mixing agitator shaft speed linked to mechanical motor reduction.
  - Arrhenius reaction kinetics: \(k(T) = A \cdot \exp(-E_a / RT)\).
  - Acid/base pH continuous balancing and vapor pressure monitoring.

### 4. ⚡ Electrical Engineering Module
- **Substation Monitoring:** Digital circular gauges for 3-Phase 415V bus voltage, total feeder line current (A), grid frequency (50.0 Hz), active power (kW), and displacement power factor (\(\cos\phi\)).
- **Substation Switchgear (SLD):** Interactive trip/close circuit breaker controls for Main Incomer ACB, Motor Feeder VCB, and Reactor Jacket Heater Breaker.
- **500 kVA Step-Down Transformer:** Mineral insulating oil temperature, apparent load ratio (%), and on-load tap changer (OLTC).
- **Tariff & Demand Analytics:** Daily, weekly, and monthly energy consumption charts (kWh).

### 5. 🔀 Interdisciplinary Plant Integration (Highlight Feature)
- **Visual Process Flow Diagram:** Interactive sequence showing:
  $$\text{Electrical Power} \rightarrow \text{Industrial Motor} \rightarrow \text{Mechanical Pump} \rightarrow \text{Mixing Tanks} \rightarrow \text{CSTR Reactor} \rightarrow \text{Finished Product}$$
- **Real-time Closed-Loop Parameter Coupling:**
  - Dragging the Motor Speed slider immediately recalculates cubic shaft electrical load (\(P \propto \omega^3\)), updates centrifugal pump flow (\(Q \propto N\)), increases reactor agitator Reynolds number, and accelerates batch conversion.
  - Simulating an electrical voltage sag or trip causes mechanical coast-down, halts pump delivery, and isolates chemical feed lines.
- **Tri-Discipline SCADA Balance Radar Chart:** Evaluates harmonious operation between Mechanical, Chemical, and Electrical systems.

### 6. 🏭 Plant Simulation Module
- Interactive 2D SCADA vector graphic blueprint of the manufacturing factory floor.
- Animated fluid flow particles through conduits with variable speed proportional to pump RPM.
- Rotating motor shaft and spinning centrifugal pump impeller SVGs.
- Glowing reactor heating jacket with boiling/reaction bubble animations.

### 7. 📈 Performance Analytics Module
- Clearly explained weighted plant efficiency formula:
  $$\eta_{\text{overall}} = (w_{\text{mech}} \times \eta_{\text{mech}}) + (w_{\text{chem}} \times \eta_{\text{chem}}) + (w_{\text{elec}} \times \eta_{\text{elec}})$$
- Overall Equipment Effectiveness (OEE): Availability (96.4%) &times; Performance (94.2%) &times; Quality (98.6%) = 89.5% OEE.
- Timeframe filtering: Last 24 Hours, Last 7 Days, Last 30 Days.

### 8. 🚨 Fault Detection & Alarm Annunciator
- Centralized SCADA alarm annunciator with Normal (Green), Warning (Yellow), and Critical (Red) classifications.
- Filter by department: Mechanical, Chemical, Electrical, or Integrated.
- Interactive operator actions: Acknowledge (ACK), Resolve, and historical audit timestamps.
- **Fault Simulator:** Instant injection of real industrial scenarios:
  - Bearing Defect (ISO 10816 vibration spike > 6.5 mm/s)
  - Centrifugal Discharge Line Clog (pressure surges to 5.8 bar)
  - Reactor Exothermic Runaway
  - Reagent Acidification (pH drops to 4.1)
  - 3-Phase Grid Voltage Sag (348V)
  - Feeder Overcurrent (> 135A)
  - Total Substation Grid Blackout

### 9. 📑 Report Generation & Export Console
- One-click downloadable **PDF Audit Report** with complete executive summary, department tables, and sign-offs.
- One-click **CSV Dataset Export** containing all historical sensor readings.

### 10. ⚙️ Settings & System Configuration
- Configurable warning/trip limits for speed, temperature, vibration, pressure, voltage, and current.
- Customizable department weighting coefficients (\(w_{\text{mech}}, w_{\text{chem}}, w_{\text{elec}}\)).
- Simulation speed toggle (0.5x, 1x, 2x, 5x, Pause).

---

## 🛠️ Technology Stack

| Tier | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, jsPDF, jsPDF-AutoTable |
| **Backend** | Python 3.11, Flask REST API, Flask-CORS, ReportLab PDF Engine |
| **Database** | SQLite3 (`plant_data.db`) storing continuous telemetry and alarm logs |
| **Simulation** | JavaScript client-side real-time twin + Python server-side differential calculations |

---

## 🚀 How to Run Locally

### Option A: One-Click Launch (Windows)
Double-click `run_app.bat` in the project root directory.

### Option B: Manual Command Line Launch

**1. Start Backend Server:**
```powershell
& "C:\Users\Sona Jain\python311\python.exe" backend/app.py
```
*(Runs on http://127.0.0.1:5000)*

**2. Start Frontend Server:**
```powershell
npm.cmd run dev
```
*(Runs on http://localhost:3000)*

Open your browser at `http://localhost:3000`.
