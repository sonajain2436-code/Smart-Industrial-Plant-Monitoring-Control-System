import { calculateMotorPhysics, calculatePumpPhysics } from './mechanicalEngine';
import { calculateChemicalPhysics } from './chemicalEngine';
import { calculateElectricalPhysics } from './electricalEngine';

export class IntegratedSimulationEngine {
  constructor(initialState = {}) {
    this.state = {
      status: 'RUNNING',
      emergency_stopped: false,
      active_faults: [],
      
      // Mechanical
      motor_enabled: true,
      motor_target_rpm: 1480,
      motor_rpm: 1480,
      motor_temp: 64.2,
      motor_vibration: 2.15,
      bearing_temp: 58.4,
      motor_efficiency: 91.8,
      
      pump_enabled: true,
      pump_target_flow: 62.5,
      pump_flow: 62.5,
      pump_pressure: 3.82,
      pump_temp: 42.1,
      pump_efficiency: 87.5,

      // Chemical
      tank_a_level: 76.5,
      tank_b_level: 68.2,
      tank_c_level: 84.0,
      tank_a_temp: 24.5,
      tank_b_temp: 25.1,
      tank_c_temp: 22.8,
      reactor_enabled: true,
      reactor_temp: 74.5,
      reactor_target_temp: 75.0,
      reactor_jacket_temp: 71.0,
      reactor_pressure: 2.65,
      reactor_ph: 7.15,
      reactor_mixing_rpm: 148.0,
      reaction_progress: 42.0,
      reagent_concentration: 88.4,
      chemical_efficiency: 92.4,

      // Electrical
      grid_voltage: 415.0,
      frequency: 50.02,
      total_current: 68.4,
      power_kw: 44.5,
      energy_kwh: 12480.5,
      power_factor: 0.942,
      breaker_main_closed: true,
      breaker_motor_closed: true,
      breaker_reactor_closed: true,
      transformer_oil_temp: 52.8,
      transformer_load_pct: 64.2,
      electrical_power_ok: true,
      electrical_efficiency: 94.1,

      // Integrated
      mechanical_efficiency: 89.6,
      overall_efficiency: 91.9,
      ...initialState
    };

    this.settings = {
      weight_mech: 0.35,
      weight_chem: 0.35,
      weight_elec: 0.30,
      motor_max_rpm: 3000,
      motor_temp_warn: 75.0,
      vibration_warn: 4.5,
      reactor_temp_warn: 85.0,
      reactor_max_press: 4.5,
      voltage_nom: 415.0
    };

    this.alerts = [];
    this.history = [];
    this.initHistory();
  }

  initHistory() {
    const now = Date.now();
    for (let i = 25; i >= 0; i--) {
      const t = new Date(now - i * 4000);
      const timeStr = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.history.push({
        time: timeStr,
        motor_rpm: 1450 + Math.random() * 40 - 20,
        pump_flow: 62 + Math.random() * 3 - 1.5,
        reactor_temp: 74 + Math.random() * 2 - 1,
        power_kw: 43 + Math.random() * 2 - 1,
        overall_eff: 91.5 + Math.random() * 1.5 - 0.75,
        mech_eff: 89.5,
        chem_eff: 92.2,
        elec_eff: 94.0,
        voltage: 415 + Math.random() * 3 - 1.5,
        current: 68 + Math.random() * 2 - 1,
      });
    }
  }

  tick(dt = 1.0) {
    // 1. Electrical step
    const elec = calculateElectricalPhysics(
      this.state,
      this.state.motor_rpm,
      this.state.pump_flow,
      this.state.reactor_enabled && this.state.breaker_reactor_closed,
      dt,
      this.state.active_faults
    );
    Object.assign(this.state, elec);

    // 2. Mechanical step
    const mechMotor = calculateMotorPhysics(this.state, dt, this.state.active_faults);
    Object.assign(this.state, mechMotor);

    const mechPump = calculatePumpPhysics(this.state, this.state.motor_rpm, dt, this.state.active_faults);
    Object.assign(this.state, mechPump);

    this.state.mechanical_efficiency = Number(
      ((this.state.motor_efficiency * 0.55) + (this.state.pump_efficiency * 0.45)).toFixed(1)
    );

    // 3. Chemical step
    const chem = calculateChemicalPhysics(
      this.state,
      this.state.pump_flow,
      this.state.motor_rpm,
      dt,
      this.state.active_faults
    );
    Object.assign(this.state, chem);

    // 4. Integrated Overall Efficiency (Weighted SCADA Formula)
    const wM = this.settings.weight_mech;
    const wC = this.settings.weight_chem;
    const wE = this.settings.weight_elec;
    const overall = (wM * this.state.mechanical_efficiency) +
                    (wC * this.state.chemical_efficiency) +
                    (wE * this.state.electrical_efficiency);
    this.state.overall_efficiency = Number(overall.toFixed(1));

    // Operational status determination
    if (this.state.emergency_stopped) {
      this.state.status = 'EMERGENCY_STOP';
    } else if (!this.state.electrical_power_ok || this.state.active_faults.length > 0) {
      this.state.status = this.state.active_faults.includes('POWER_OUTAGE') || !this.state.breaker_main_closed ? 'FAULT' : 'WARNING';
    } else if (this.state.motor_enabled || this.state.pump_enabled || this.state.reactor_enabled) {
      this.state.status = 'RUNNING';
    } else {
      this.state.status = 'STOPPED';
    }

    // Append to live historical buffer
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.history.push({
      time: nowStr,
      motor_rpm: this.state.motor_rpm,
      pump_flow: this.state.pump_flow,
      reactor_temp: this.state.reactor_temp,
      power_kw: this.state.power_kw,
      overall_eff: this.state.overall_efficiency,
      mech_eff: this.state.mechanical_efficiency,
      chem_eff: this.state.chemical_efficiency,
      elec_eff: this.state.electrical_efficiency,
      voltage: this.state.grid_voltage,
      current: this.state.total_current,
    });
    if (this.history.length > 30) {
      this.history.shift();
    }

    return this.getSnapshot();
  }

  getSnapshot() {
    return {
      status: this.state.status,
      emergency_stopped: this.state.emergency_stopped,
      active_faults: [...this.state.active_faults],
      mechanical: {
        motor_enabled: this.state.motor_enabled,
        motor_target_rpm: this.state.motor_target_rpm,
        motor_rpm: this.state.motor_rpm,
        motor_temp: this.state.motor_temp,
        motor_vibration: this.state.motor_vibration,
        bearing_temp: this.state.bearing_temp,
        motor_efficiency: this.state.motor_efficiency,
        pump_enabled: this.state.pump_enabled,
        pump_target_flow: this.state.pump_target_flow,
        pump_flow: this.state.pump_flow,
        pump_pressure: this.state.pump_pressure,
        pump_temp: this.state.pump_temp,
        pump_efficiency: this.state.pump_efficiency,
      },
      chemical: {
        tank_a_level: this.state.tank_a_level,
        tank_b_level: this.state.tank_b_level,
        tank_c_level: this.state.tank_c_level,
        tank_a_temp: this.state.tank_a_temp,
        tank_b_temp: this.state.tank_b_temp,
        tank_c_temp: this.state.tank_c_temp,
        reactor_enabled: this.state.reactor_enabled,
        reactor_temp: this.state.reactor_temp,
        reactor_target_temp: this.state.reactor_target_temp,
        reactor_jacket_temp: this.state.reactor_jacket_temp,
        reactor_pressure: this.state.reactor_pressure,
        reactor_ph: this.state.reactor_ph,
        reactor_mixing_rpm: this.state.reactor_mixing_rpm,
        reaction_progress: this.state.reaction_progress,
        reagent_concentration: this.state.reagent_concentration,
      },
      electrical: {
        grid_voltage: this.state.grid_voltage,
        frequency: this.state.frequency,
        total_current: this.state.total_current,
        power_kw: this.state.power_kw,
        energy_kwh: this.state.energy_kwh,
        power_factor: this.state.power_factor,
        breaker_main_closed: this.state.breaker_main_closed,
        breaker_motor_closed: this.state.breaker_motor_closed,
        breaker_reactor_closed: this.state.breaker_reactor_closed,
        transformer_oil_temp: this.state.transformer_oil_temp,
        transformer_load_pct: this.state.transformer_load_pct,
      },
      efficiencies: {
        mechanical: this.state.mechanical_efficiency,
        chemical: this.state.chemical_efficiency,
        electrical: this.state.electrical_efficiency,
        overall: this.state.overall_efficiency,
      },
      plant_health: {
        score: this.state.overall_efficiency,
        total_machines: 7,
        running_machines: (this.state.motor_enabled && this.state.motor_rpm > 50 ? 1 : 0) +
                          (this.state.pump_enabled && this.state.pump_flow > 5 ? 1 : 0) +
                          (this.state.reactor_enabled && this.state.reactor_mixing_rpm > 10 ? 1 : 0) +
                          (this.state.breaker_main_closed ? 1 : 0) +
                          (this.state.breaker_motor_closed ? 1 : 0) +
                          (this.state.breaker_reactor_closed ? 1 : 0) + 1,
        stopped_machines: 7 - ((this.state.motor_enabled && this.state.motor_rpm > 50 ? 1 : 0) +
                              (this.state.pump_enabled && this.state.pump_flow > 5 ? 1 : 0) +
                              (this.state.reactor_enabled && this.state.reactor_mixing_rpm > 10 ? 1 : 0) +
                              (this.state.breaker_main_closed ? 1 : 0) +
                              (this.state.breaker_motor_closed ? 1 : 0) +
                              (this.state.breaker_reactor_closed ? 1 : 0) + 1)
      }
    };
  }
}
