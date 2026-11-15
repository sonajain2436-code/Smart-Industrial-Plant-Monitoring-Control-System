import math
import random
import time
from datetime import datetime
from database import log_telemetry, insert_alert, get_settings

class PlantSimulationEngine:
    def __init__(self):
        # Operational State
        self.status = "RUNNING"  # 'RUNNING', 'STOPPED', 'EMERGENCY_STOP', 'FAULT'
        self.emergency_stopped = False
        self.active_faults = set()
        
        # Mechanical Department Equipment
        self.motor_enabled = True
        self.motor_target_rpm = 1480.0
        self.motor_rpm = 1480.0
        self.motor_temp = 64.2
        self.motor_vibration = 2.15  # mm/s RMS
        self.bearing_temp = 58.4
        self.motor_efficiency = 91.8
        
        self.pump_enabled = True
        self.pump_target_flow = 62.5  # L/min
        self.pump_flow = 62.5
        self.pump_pressure = 3.82  # bar
        self.pump_temp = 42.1
        self.pump_efficiency = 87.5
        
        # Chemical Department Equipment
        self.tank_a_level = 76.5  # %
        self.tank_b_level = 68.2  # %
        self.tank_c_level = 84.0  # %
        self.tank_a_temp = 24.5
        self.tank_b_temp = 25.1
        self.tank_c_temp = 22.8
        
        # Chemical Reactor
        self.reactor_enabled = True
        self.reactor_temp = 74.5  # °C
        self.reactor_target_temp = 75.0  # Setpoint
        self.reactor_pressure = 2.65  # bar
        self.reactor_ph = 7.15
        self.reactor_mixing_rpm = 148.0
        self.reaction_progress = 42.0  # %
        self.reagent_concentration = 88.4  # %
        self.reactor_jacket_temp = 71.0
        
        # Electrical Department Equipment
        self.grid_voltage = 415.0  # V 3-phase line
        self.frequency = 50.02  # Hz
        self.breaker_main_closed = True
        self.breaker_motor_closed = True
        self.breaker_reactor_closed = True
        self.total_current = 68.4  # Amperes
        self.power_kw = 44.5  # kW
        self.energy_kwh = 12480.5  # Cumulative kWh
        self.power_factor = 0.942
        self.transformer_oil_temp = 52.8  # °C
        self.transformer_load_pct = 64.2  # %
        
        # Interdisciplinary Metrics
        self.eff_mechanical = 89.6
        self.eff_chemical = 92.4
        self.eff_electrical = 94.1
        self.eff_overall = 91.9
        
        self.last_tick_time = time.time()
        self.last_log_time = time.time()

    def set_control(self, action, payload=None):
        payload = payload or {}
        if action == "START_PLANT":
            self.status = "RUNNING"
            self.emergency_stopped = False
            self.motor_enabled = True
            self.pump_enabled = True
            self.reactor_enabled = True
            self.breaker_main_closed = True
            self.breaker_motor_closed = True
            self.breaker_reactor_closed = True
            if self.motor_target_rpm == 0:
                self.motor_target_rpm = 1480.0
        elif action == "STOP_PLANT":
            self.status = "STOPPED"
            self.motor_enabled = False
            self.pump_enabled = False
            self.reactor_enabled = False
        elif action == "EMERGENCY_STOP":
            self.status = "EMERGENCY_STOP"
            self.emergency_stopped = True
            self.motor_enabled = False
            self.pump_enabled = False
            self.reactor_enabled = False
            self.motor_target_rpm = 0.0
            self.breaker_motor_closed = False
            self.breaker_reactor_closed = False
            insert_alert("INTEGRATED", "CRITICAL", "EMERGENCY STOP ACTIVATED", "Manual E-Stop tripped. All motors de-energized, chemical valves isolated.")
        elif action == "RESET_SYSTEM":
            self.status = "STOPPED"
            self.emergency_stopped = False
            self.active_faults.clear()
            self.breaker_main_closed = True
            self.breaker_motor_closed = True
            self.breaker_reactor_closed = True
            self.reactor_pressure = 2.0
            self.reactor_temp = 35.0
            self.motor_temp = 40.0
            self.motor_vibration = 1.2
            self.reaction_progress = 0.0
            insert_alert("INTEGRATED", "INFO", "System Reset Completed", "All interdisciplinary safety interlocks restored. Plant in safe standby.")
        elif action == "SET_MOTOR_RPM":
            rpm = float(payload.get("rpm", 1480))
            self.motor_target_rpm = max(0, min(3000, rpm))
            if self.motor_target_rpm > 0 and not self.emergency_stopped:
                self.motor_enabled = True
        elif action == "TOGGLE_MOTOR":
            self.motor_enabled = bool(payload.get("enabled", not self.motor_enabled))
            if not self.motor_enabled:
                self.motor_target_rpm = 0.0
            else:
                self.motor_target_rpm = 1480.0
        elif action == "SET_PUMP_FLOW":
            flow = float(payload.get("flow", 60.0))
            self.pump_target_flow = max(0, min(120, flow))
        elif action == "TOGGLE_PUMP":
            self.pump_enabled = bool(payload.get("enabled", not self.pump_enabled))
        elif action == "SET_REACTOR_TEMP":
            temp = float(payload.get("temp", 75.0))
            self.reactor_target_temp = max(20, min(120, temp))
        elif action == "SET_MIXING_SPEED":
            rpm = float(payload.get("rpm", 150.0))
            self.reactor_mixing_rpm = max(0, min(500, rpm))
        elif action == "TOGGLE_REACTOR":
            self.reactor_enabled = bool(payload.get("enabled", not self.reactor_enabled))
        elif action == "TOGGLE_BREAKER":
            breaker = payload.get("breaker", "main")
            if breaker == "main":
                self.breaker_main_closed = not self.breaker_main_closed
                if not self.breaker_main_closed:
                    self.motor_enabled = False
                    self.pump_enabled = False
                    self.reactor_enabled = False
                    insert_alert("ELECTRICAL", "CRITICAL", "Main ACB Breaker Tripped", "Incoming 415V supply interrupted to all plant MCC panels.")
            elif breaker == "motor":
                self.breaker_motor_closed = not self.breaker_motor_closed
                if not self.breaker_motor_closed:
                    self.motor_enabled = False
            elif breaker == "reactor":
                self.breaker_reactor_closed = not self.breaker_reactor_closed
                if not self.breaker_reactor_closed:
                    self.reactor_enabled = False

    def inject_fault(self, fault_type):
        self.active_faults.add(fault_type)
        if fault_type == "BEARING_FAULT":
            insert_alert("MECHANICAL", "CRITICAL", "Severe Motor Bearing Degradation", "Acoustic emission sensor and accelerometer detect high bearing race defect frequency.")
        elif fault_type == "VOLTAGE_SAG":
            insert_alert("ELECTRICAL", "WARNING", "Grid Voltage Sag Detected", "Phase L1-L2 voltage sagged below -12% nominal grid threshold.")
        elif fault_type == "OVERCURRENT":
            insert_alert("ELECTRICAL", "CRITICAL", "Feeder Overcurrent Overload", "Current draw exceeded 135A threshold on MCC Panel 1.")
        elif fault_type == "PIPE_CLOG":
            insert_alert("MECHANICAL", "WARNING", "Centrifugal Pump Discharge Line Restricted", "Discharge pressure spiked to 5.8 bar with flow drop detected.")
        elif fault_type == "REACTOR_EXOTHERM":
            insert_alert("CHEMICAL", "CRITICAL", "Thermal Runaway Warning in Reactor #1", "Exothermic reaction rate exceeded jacket cooling capacity. Temp climbing rapidly.")
        elif fault_type == "PH_ACID_SPIKE":
            insert_alert("CHEMICAL", "WARNING", "Abnormal Chemical Reactor Acidification", "pH sensor reads 4.8. Reagent valve imbalance detected.")
        elif fault_type == "POWER_OUTAGE":
            self.breaker_main_closed = False
            self.status = "FAULT"
            insert_alert("ELECTRICAL", "CRITICAL", "Total Incoming Substation Power Failure", "Grid loss detected. Emergency generator auto-start triggered for critical monitoring.")

    def clear_fault(self, fault_type=None):
        if fault_type:
            self.active_faults.discard(fault_type)
        else:
            self.active_faults.clear()

    def update_physics(self):
        """Simulate dynamic cross-department physical coupling."""
        now = time.time()
        dt = min(3.0, max(0.5, now - self.last_tick_time))
        self.last_tick_time = now

        # 1. ELECTRICAL DYNAMICS
        if not self.breaker_main_closed or "POWER_OUTAGE" in self.active_faults:
            self.grid_voltage = 0.0
            self.frequency = 0.0
            self.total_current = 0.0
            self.power_kw = 0.0
            self.status = "FAULT" if not self.emergency_stopped else "EMERGENCY_STOP"
        else:
            if "VOLTAGE_SAG" in self.active_faults:
                self.grid_voltage = 352.0 + random.uniform(-4, 4)
            elif "OVERVOLTAGE" in self.active_faults:
                self.grid_voltage = 458.0 + random.uniform(-3, 3)
            else:
                self.grid_voltage = 415.0 + random.uniform(-2.5, 2.5)

            self.frequency = 50.0 + random.uniform(-0.05, 0.05)

        # 2. MECHANICAL DYNAMICS (Coupled to Electrical)
        if self.status in ["STOPPED", "EMERGENCY_STOP"] or not self.breaker_motor_closed or self.grid_voltage < 300:
            target_motor_speed = 0.0
        else:
            target_motor_speed = self.motor_target_rpm if self.motor_enabled else 0.0

        # Motor acceleration/deceleration smoothing
        speed_delta = target_motor_speed - self.motor_rpm
        self.motor_rpm += speed_delta * min(1.0, 0.4 * dt)
        if abs(self.motor_rpm) < 1.0:
            self.motor_rpm = 0.0

        rpm_ratio = (self.motor_rpm / 1500.0) if self.motor_rpm > 0 else 0.0

        # Motor Temperature & Vibration
        ambient_temp = 28.0
        if "BEARING_FAULT" in self.active_faults:
            vibration_base = 6.8 + random.uniform(0.5, 1.8)
            target_bearing_temp = 92.0 + 15.0 * rpm_ratio
            target_motor_temp = 85.0 + 20.0 * rpm_ratio
        else:
            vibration_base = 1.2 + 1.4 * (rpm_ratio ** 1.8) + random.uniform(-0.1, 0.1)
            target_bearing_temp = ambient_temp + 28.0 * rpm_ratio
            target_motor_temp = ambient_temp + 36.0 * rpm_ratio

        self.motor_vibration = max(0.2, vibration_base if self.motor_rpm > 50 else 0.2 + random.uniform(0, 0.05))
        self.bearing_temp += (target_bearing_temp - self.bearing_temp) * 0.1 * dt
        self.motor_temp += (target_motor_temp - self.motor_temp) * 0.08 * dt
        self.motor_efficiency = max(70.0, min(95.5, 93.0 - (5.0 if "BEARING_FAULT" in self.active_faults else 0.0) - abs(1.0 - rpm_ratio) * 12.0))

        # Centrifugal Pump Dynamics (Directly coupled to Motor RPM)
        if self.pump_enabled and self.motor_rpm > 100:
            slip_factor = 0.7 if "PIPE_CLOG" in self.active_faults else 1.0
            target_flow = (self.motor_rpm / 1500.0) * 65.0 * slip_factor
            target_press = (self.motor_rpm / 1500.0)**1.9 * (5.8 if "PIPE_CLOG" in self.active_faults else 3.8)
        else:
            target_flow = 0.0
            target_press = 0.0

        self.pump_flow += (target_flow - self.pump_flow) * 0.5 * dt
        self.pump_pressure += (target_press - self.pump_pressure) * 0.5 * dt
        self.pump_temp += (ambient_temp + 14.0 * (self.pump_flow / 65.0) - self.pump_temp) * 0.1 * dt
        self.pump_efficiency = max(60.0, min(91.0, 88.0 - (18.0 if "PIPE_CLOG" in self.active_faults else 0.0)))

        # 3. CHEMICAL DYNAMICS (Coupled to Pump & Reactor Heater)
        # Pump feeds Reagents into the Reactor
        if self.pump_flow > 5.0 and self.status == "RUNNING":
            feed_rate = (self.pump_flow / 65.0) * 0.15 * dt
            self.tank_a_level = max(5.0, self.tank_a_level - feed_rate * 0.8)
            self.tank_b_level = max(5.0, self.tank_b_level - feed_rate * 0.6)
            self.tank_c_level = max(5.0, self.tank_c_level - feed_rate * 0.2)
            
            # Agitator mixes the contents
            self.reactor_mixing_rpm = self.motor_rpm * 0.1  # Mechanical reduction coupling

            # Reaction progress advances with mixing & temperature
            if self.reactor_enabled and self.reactor_temp > 45.0:
                k_rate = math.exp(-2500.0 / (self.reactor_temp + 273.15)) * (self.reactor_mixing_rpm / 150.0) * 35.0
                self.reaction_progress = min(100.0, self.reaction_progress + k_rate * 0.1 * dt)
                if self.reaction_progress >= 99.5:
                    self.reaction_progress = 0.0  # Batch cycle completed, new batch begins
        else:
            self.reactor_mixing_rpm = 0.0

        # Reactor Temperature & Pressure Dynamics
        if "REACTOR_EXOTHERM" in self.active_faults:
            heat_gen = 6.5 * dt
            target_r_temp = self.reactor_target_temp + 35.0
            target_r_press = 5.2
        elif self.reactor_enabled and self.breaker_reactor_closed and self.status == "RUNNING":
            heat_gen = 0.8 * dt if self.reactor_temp < self.reactor_target_temp else -0.5 * dt
            target_r_temp = self.reactor_target_temp
            target_r_press = 2.4 + 1.2 * (self.reactor_temp / 100.0)
        else:
            target_r_temp = ambient_temp
            target_r_press = 1.0

        self.reactor_temp += (target_r_temp - self.reactor_temp) * 0.12 * dt
        self.reactor_pressure += (target_r_press - self.reactor_pressure) * 0.2 * dt
        self.reactor_jacket_temp = self.reactor_temp - 3.5 + random.uniform(-0.5, 0.5)

        # pH dynamics
        if "PH_ACID_SPIKE" in self.active_faults:
            self.reactor_ph += (4.2 - self.reactor_ph) * 0.2 * dt
        else:
            self.reactor_ph += (7.2 + random.uniform(-0.15, 0.15) - self.reactor_ph) * 0.1 * dt

        self.eff_chemical = max(50.0, min(98.5, 94.0 - abs(self.reactor_ph - 7.2) * 8.0 - (20.0 if "REACTOR_EXOTHERM" in self.active_faults else 0.0)))

        # 4. ELECTRICAL LOAD CALCULATION (Coupled back from Mechanical & Chemical Heaters)
        if self.grid_voltage > 300:
            # Mechanical motor power = sqrt(3)*V*I*pf*eff
            motor_power_kw = (18.5 * (self.motor_rpm / 1500.0)**2.5) if self.motor_rpm > 0 else 0.5
            pump_mech_kw = (7.5 * (self.pump_flow / 65.0)**2) if self.pump_flow > 0 else 0.2
            reactor_heater_kw = 15.0 if (self.reactor_enabled and self.reactor_temp < self.reactor_target_temp) else 2.5
            aux_kw = 3.8  # Control panels, lighting, instrumentation

            total_kw = motor_power_kw + pump_mech_kw + reactor_heater_kw + aux_kw
            if "OVERCURRENT" in self.active_faults:
                total_kw *= 1.7

            self.power_factor = 0.94 if "BEARING_FAULT" not in self.active_faults else 0.86
            self.power_kw = round(total_kw, 2)
            # 3-phase current I = P / (sqrt(3) * V * cos_phi)
            self.total_current = round((self.power_kw * 1000.0) / (1.732 * self.grid_voltage * self.power_factor), 1)
            self.energy_kwh += (self.power_kw * (dt / 3600.0))
            self.transformer_load_pct = min(100.0, round((self.power_kw / 75.0) * 100.0, 1))
            self.transformer_oil_temp += (ambient_temp + 32.0 * (self.transformer_load_pct / 100.0) - self.transformer_oil_temp) * 0.05 * dt
        else:
            self.power_kw = 0.0
            self.total_current = 0.0
            self.transformer_load_pct = 0.0

        # Efficiencies
        self.eff_mechanical = round((self.motor_efficiency * 0.55 + self.pump_efficiency * 0.45), 1)
        self.eff_electrical = round(min(98.0, max(60.0, (self.power_factor / 0.95) * 94.0)), 1)
        
        # Overall weighted plant efficiency formula
        settings = get_settings()
        w_m = settings.get("weight_mech", 0.35)
        w_c = settings.get("weight_chem", 0.35)
        w_e = settings.get("weight_elec", 0.30)
        self.eff_overall = round(w_m * self.eff_mechanical + w_c * self.eff_chemical + w_e * self.eff_electrical, 1)

        # Periodic SQLite logging (every 10 seconds of simulated time)
        if now - self.last_log_time >= 10.0:
            self.last_log_time = now
            try:
                log_telemetry({
                    "timestamp": datetime.now().isoformat(),
                    "motor_rpm": round(self.motor_rpm, 1),
                    "motor_temp": round(self.motor_temp, 1),
                    "motor_vibration": round(self.motor_vibration, 2),
                    "pump_flow": round(self.pump_flow, 1),
                    "pump_pressure": round(self.pump_pressure, 2),
                    "tank_a_level": round(self.tank_a_level, 1),
                    "tank_b_level": round(self.tank_b_level, 1),
                    "tank_c_level": round(self.tank_c_level, 1),
                    "reactor_temp": round(self.reactor_temp, 1),
                    "reactor_pressure": round(self.reactor_pressure, 2),
                    "reactor_ph": round(self.reactor_ph, 2),
                    "reaction_progress": round(self.reaction_progress, 1),
                    "voltage": round(self.grid_voltage, 1),
                    "current": round(self.total_current, 1),
                    "power_kw": round(self.power_kw, 2),
                    "energy_kwh": round(self.energy_kwh, 2),
                    "power_factor": round(self.power_factor, 3),
                    "frequency": round(self.frequency, 2),
                    "eff_mech": round(self.eff_mechanical, 1),
                    "eff_chem": round(self.eff_chemical, 1),
                    "eff_elec": round(self.eff_electrical, 1),
                    "eff_overall": round(self.eff_overall, 1),
                    "plant_status": self.status
                })
            except Exception as e:
                print(f"Telemetry log error: {e}")

    def get_snapshot(self):
        self.update_physics()
        return {
            "status": self.status,
            "emergency_stopped": self.emergency_stopped,
            "active_faults": list(self.active_faults),
            "mechanical": {
                "motor_enabled": self.motor_enabled,
                "motor_target_rpm": self.motor_target_rpm,
                "motor_rpm": round(self.motor_rpm, 1),
                "motor_temp": round(self.motor_temp, 1),
                "motor_vibration": round(self.motor_vibration, 2),
                "bearing_temp": round(self.bearing_temp, 1),
                "motor_efficiency": round(self.motor_efficiency, 1),
                "pump_enabled": self.pump_enabled,
                "pump_target_flow": self.pump_target_flow,
                "pump_flow": round(self.pump_flow, 1),
                "pump_pressure": round(self.pump_pressure, 2),
                "pump_temp": round(self.pump_temp, 1),
                "pump_efficiency": round(self.pump_efficiency, 1)
            },
            "chemical": {
                "tank_a_level": round(self.tank_a_level, 1),
                "tank_b_level": round(self.tank_b_level, 1),
                "tank_c_level": round(self.tank_c_level, 1),
                "tank_a_temp": round(self.tank_a_temp, 1),
                "tank_b_temp": round(self.tank_b_temp, 1),
                "tank_c_temp": round(self.tank_c_temp, 1),
                "reactor_enabled": self.reactor_enabled,
                "reactor_temp": round(self.reactor_temp, 1),
                "reactor_target_temp": round(self.reactor_target_temp, 1),
                "reactor_jacket_temp": round(self.reactor_jacket_temp, 1),
                "reactor_pressure": round(self.reactor_pressure, 2),
                "reactor_ph": round(self.reactor_ph, 2),
                "reactor_mixing_rpm": round(self.reactor_mixing_rpm, 1),
                "reaction_progress": round(self.reaction_progress, 1),
                "reagent_concentration": round(self.reagent_concentration, 1)
            },
            "electrical": {
                "grid_voltage": round(self.grid_voltage, 1),
                "frequency": round(self.frequency, 2),
                "total_current": round(self.total_current, 1),
                "power_kw": round(self.power_kw, 2),
                "energy_kwh": round(self.energy_kwh, 2),
                "power_factor": round(self.power_factor, 3),
                "breaker_main_closed": self.breaker_main_closed,
                "breaker_motor_closed": self.breaker_motor_closed,
                "breaker_reactor_closed": self.breaker_reactor_closed,
                "transformer_oil_temp": round(self.transformer_oil_temp, 1),
                "transformer_load_pct": round(self.transformer_load_pct, 1)
            },
            "efficiencies": {
                "mechanical": round(self.eff_mechanical, 1),
                "chemical": round(self.eff_chemical, 1),
                "electrical": round(self.eff_electrical, 1),
                "overall": round(self.eff_overall, 1)
            },
            "plant_health": {
                "score": round(self.eff_overall, 1),
                "total_machines": 7,
                "running_machines": (1 if self.motor_enabled and self.motor_rpm > 50 else 0) +
                                   (1 if self.pump_enabled and self.pump_flow > 5 else 0) +
                                   (1 if self.reactor_enabled and self.reactor_mixing_rpm > 10 else 0) +
                                   (1 if self.breaker_main_closed else 0) +
                                   (1 if self.breaker_motor_closed else 0) +
                                   (1 if self.breaker_reactor_closed else 0) + 1,
                "stopped_machines": 7 - ((1 if self.motor_enabled and self.motor_rpm > 50 else 0) +
                                         (1 if self.pump_enabled and self.pump_flow > 5 else 0) +
                                         (1 if self.reactor_enabled and self.reactor_mixing_rpm > 10 else 0) +
                                         (1 if self.breaker_main_closed else 0) +
                                         (1 if self.breaker_motor_closed else 0) +
                                         (1 if self.breaker_reactor_closed else 0) + 1)
            }
        }

engine = PlantSimulationEngine()
