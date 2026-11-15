/**
 * Chemical Engineering Simulation Module
 * Simulates CSTR reactor mass & energy balances, Arrhenius reaction kinetics,
 * jacket heat exchanger thermodynamics, and continuous storage tank inventories.
 */

export function calculateChemicalPhysics(state, pumpFlow, motorRpm, dt = 1.0, activeFaults = []) {
  const hasExothermFault = activeFaults.includes('REACTOR_EXOTHERM');
  const hasPhFault = activeFaults.includes('PH_ACID_SPIKE');

  // Storage tanks inventory depletion based on pump flow
  const feedRatio = (pumpFlow / 65.0) * 0.08 * dt;
  let tankA = Math.max(5.0, state.tank_a_level - feedRatio * 0.8);
  let tankB = Math.max(5.0, state.tank_b_level - feedRatio * 0.65);
  let tankC = Math.max(5.0, state.tank_c_level - feedRatio * 0.3);

  // If tanks get refilled or empty
  if (tankA < 8.0) tankA = 95.0; // Auto replenishment cycle for simulation continuity
  if (tankB < 8.0) tankB = 92.0;
  if (tankC < 8.0) tankC = 90.0;

  // Reactor Agitator mixing RPM mechanically reduced from motor shaft
  const targetAgitatorRpm = (motorRpm / 10.0);
  const mixingRpm = state.reactor_mixing_rpm + (targetAgitatorRpm - state.reactor_mixing_rpm) * 0.3 * dt;

  // Temperature dynamics & Arrhenius reaction kinetics
  const ambient = 25.0;
  let targetTemp = ambient;
  let targetPressure = 1.013; // 1 atm bar

  if (state.reactor_enabled && state.electrical_power_ok) {
    if (hasExothermFault) {
      targetTemp = state.reactor_target_temp + 38.0;
      targetPressure = 5.2;
    } else {
      targetTemp = state.reactor_target_temp;
      // Vapor pressure rises exponentially with temperature
      const tempK = state.reactor_temp + 273.15;
      targetPressure = 1.2 + 2.2 * Math.pow(tempK / 350.0, 3.2);
    }
  }

  const reactorTemp = state.reactor_temp + (targetTemp - state.reactor_temp) * 0.08 * dt;
  const jacketTemp = reactorTemp - (hasExothermFault ? -4.0 : 3.5);
  const reactorPressure = state.reactor_pressure + (targetPressure - state.reactor_pressure) * 0.15 * dt;

  // Reaction conversion progress (%)
  let progress = state.reaction_progress;
  if (state.reactor_enabled && pumpFlow > 5.0 && reactorTemp > 45.0) {
    // Arrhenius rate factor
    const kRate = Math.exp(-2200.0 / (reactorTemp + 273.15)) * (mixingRpm / 150.0) * 32.0;
    progress = progress + kRate * 0.12 * dt;
    if (progress >= 100.0) {
      progress = 0.0; // Completed batch, starts new batch
    }
  }

  // pH dynamic balance
  let targetPh = 7.2;
  if (hasPhFault) {
    targetPh = 4.1; // Acidic spike
  } else if (pumpFlow < 2.0) {
    targetPh = 7.0;
  }
  const ph = state.reactor_ph + (targetPh - state.reactor_ph) * 0.1 * dt;

  // Chemical process yield / efficiency
  let chemEfficiency = 93.5;
  if (state.reactor_enabled) {
    const phDeviation = Math.abs(ph - 7.2);
    const tempDeviation = Math.abs(reactorTemp - state.reactor_target_temp);
    chemEfficiency = 95.0 - (phDeviation * 8.0) - (tempDeviation * 0.4) - (hasExothermFault ? 25.0 : 0.0);
    chemEfficiency = Math.max(52.0, Math.min(98.5, chemEfficiency));
  } else {
    chemEfficiency = 75.0;
  }

  return {
    tank_a_level: Number(tankA.toFixed(1)),
    tank_b_level: Number(tankB.toFixed(1)),
    tank_c_level: Number(tankC.toFixed(1)),
    reactor_mixing_rpm: Math.round(mixingRpm),
    reactor_temp: Number(reactorTemp.toFixed(1)),
    reactor_jacket_temp: Number(jacketTemp.toFixed(1)),
    reactor_pressure: Number(reactorPressure.toFixed(2)),
    reaction_progress: Number(progress.toFixed(1)),
    reactor_ph: Number(ph.toFixed(2)),
    reagent_concentration: Number((88.0 + Math.sin(Date.now() / 10000) * 2).toFixed(1)),
    chemical_efficiency: Number(chemEfficiency.toFixed(1))
  };
}
