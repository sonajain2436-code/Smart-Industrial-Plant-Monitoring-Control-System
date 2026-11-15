/**
 * Electrical Engineering Simulation Module
 * Simulates 3-Phase 415V distribution bus, IEC power factor calculations,
 * induction motor load reflection, transformer thermals, and VCB/ACB protection tripping.
 */

export function calculateElectricalPhysics(state, motorRpm, pumpFlow, reactorActive, dt = 1.0, activeFaults = []) {
  const hasVoltageSag = activeFaults.includes('VOLTAGE_SAG');
  const hasOvervoltage = activeFaults.includes('OVERVOLTAGE');
  const hasOvercurrent = activeFaults.includes('OVERCURRENT');
  const hasPowerOutage = activeFaults.includes('POWER_OUTAGE');

  const mainBreakerClosed = state.breaker_main_closed && !hasPowerOutage;

  if (!mainBreakerClosed) {
    return {
      grid_voltage: 0.0,
      frequency: 0.0,
      total_current: 0.0,
      power_kw: 0.0,
      power_factor: 0.0,
      transformer_load_pct: 0.0,
      electrical_power_ok: false,
      electrical_efficiency: 0.0,
      energy_kwh: state.energy_kwh
    };
  }

  // Voltage fluctuations
  let nominalVoltage = 415.0;
  if (hasVoltageSag) nominalVoltage = 348.0;
  else if (hasOvervoltage) nominalVoltage = 462.0;

  const voltage = nominalVoltage + (Math.random() * 2.4 - 1.2);
  const frequency = 50.0 + (Math.random() * 0.08 - 0.04);

  // Power demand calculation
  // Motor shaft power
  const motorRatio = motorRpm / 1500.0;
  const motorKw = motorRpm > 10 ? 18.5 * Math.pow(motorRatio, 2.4) : 0.4;
  const pumpKw = pumpFlow > 2 ? 7.5 * Math.pow(pumpFlow / 65.0, 2.0) : 0.2;
  const reactorHeaterKw = reactorActive ? 15.0 : 2.0;
  const auxInstrumentationKw = 3.8;

  let totalKw = motorKw + pumpKw + reactorHeaterKw + auxInstrumentationKw;
  if (hasOvercurrent) totalKw *= 1.75;

  const powerFactor = activeFaults.includes('BEARING_FAULT') ? 0.86 : 0.945;

  // 3-Phase Line Current: I = P / (sqrt(3) * V * pf)
  const current = (totalKw * 1000.0) / (1.732 * voltage * powerFactor);
  const energyAdded = totalKw * (dt / 3600.0);
  const energyKwh = state.energy_kwh + energyAdded;

  // Transformer rating: 75 kW nominal
  const xfmrLoadPct = Math.min(100.0, (totalKw / 75.0) * 100.0);
  const ambient = 25.0;
  const targetOilTemp = ambient + 30.0 * (xfmrLoadPct / 100.0);
  const oilTemp = state.transformer_oil_temp + (targetOilTemp - state.transformer_oil_temp) * 0.05 * dt;

  // Electrical Efficiency
  const elecEff = Math.min(97.5, Math.max(65.0, (powerFactor / 0.95) * 94.0));

  return {
    grid_voltage: Number(voltage.toFixed(1)),
    frequency: Number(frequency.toFixed(2)),
    total_current: Number(current.toFixed(1)),
    power_kw: Number(totalKw.toFixed(2)),
    power_factor: Number(powerFactor.toFixed(3)),
    energy_kwh: Number(energyKwh.toFixed(2)),
    transformer_oil_temp: Number(oilTemp.toFixed(1)),
    transformer_load_pct: Number(xfmrLoadPct.toFixed(1)),
    electrical_power_ok: voltage >= 320.0,
    electrical_efficiency: Number(elecEff.toFixed(1))
  };
}
