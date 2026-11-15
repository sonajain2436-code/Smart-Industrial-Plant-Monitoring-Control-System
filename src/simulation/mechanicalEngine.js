/**
 * Mechanical Engineering Simulation Module
 * Implements ISO 10816 vibration modeling, centrifugal pump affinity laws,
 * induction motor thermal dissipation, and hydrodynamic head calculations.
 */

export function calculateMotorPhysics(state, dt = 1.0, activeFaults = []) {
  const isPowered = state.motor_enabled && state.electrical_power_ok;
  const targetRpm = isPowered ? state.motor_target_rpm : 0.0;
  
  // Acceleration / inertia dynamics (tau = 1.8s)
  const accelRate = 0.5 * dt;
  let rpm = state.motor_rpm + (targetRpm - state.motor_rpm) * accelRate;
  if (rpm < 5) rpm = 0;

  const speedRatio = rpm / 1500.0;
  const hasBearingFault = activeFaults.includes('BEARING_FAULT');
  const hasPipeClog = activeFaults.includes('PIPE_CLOG');

  // ISO 10816 Vibration Modeling (mm/s RMS)
  let vibration = 0.8;
  if (rpm > 10) {
    const baseVib = 1.2 * Math.pow(speedRatio, 1.6);
    const unbalance = 0.3 * Math.sin(Date.now() / 300);
    const faultVib = hasBearingFault ? 4.8 + Math.random() * 1.5 : 0;
    vibration = baseVib + unbalance + faultVib;
  }
  vibration = Math.max(0.1, Number(vibration.toFixed(2)));

  // Thermal dissipation (ambient = 26°C)
  const ambient = 26.0;
  const targetCoreTemp = ambient + (rpm > 10 ? 38.0 * Math.pow(speedRatio, 1.4) : 0) + (hasBearingFault ? 25.0 : 0);
  const targetBearingTemp = ambient + (rpm > 10 ? 29.0 * Math.pow(speedRatio, 1.5) : 0) + (hasBearingFault ? 32.0 : 0);

  const motorTemp = state.motor_temp + (targetCoreTemp - state.motor_temp) * 0.08 * dt;
  const bearingTemp = state.bearing_temp + (targetBearingTemp - state.bearing_temp) * 0.1 * dt;

  // Motor Mechanical Efficiency curve
  let motorEfficiency = 0.0;
  if (rpm > 100) {
    motorEfficiency = 92.5 - Math.abs(1.0 - speedRatio) * 10.0 - (hasBearingFault ? 6.0 : 0.0);
    motorEfficiency = Math.max(68.0, Math.min(95.5, motorEfficiency));
  }

  return {
    motor_rpm: Math.round(rpm),
    motor_temp: Number(motorTemp.toFixed(1)),
    bearing_temp: Number(bearingTemp.toFixed(1)),
    motor_vibration: vibration,
    motor_efficiency: Number(motorEfficiency.toFixed(1)),
  };
}

export function calculatePumpPhysics(state, motorRpm, dt = 1.0, activeFaults = []) {
  const isPumpActive = state.pump_enabled && motorRpm > 100;
  const speedRatio = motorRpm / 1500.0;
  const hasPipeClog = activeFaults.includes('PIPE_CLOG');

  // Affinity Laws: Flow Q proportional to N; Head H proportional to N^2
  let targetFlow = 0;
  let targetPressure = 0;

  if (isPumpActive) {
    const flowRestriction = hasPipeClog ? 0.65 : 1.0;
    targetFlow = 65.0 * speedRatio * flowRestriction;
    // Pressure rises dramatically if restricted/clogged
    targetPressure = Math.pow(speedRatio, 1.9) * (hasPipeClog ? 6.2 : 3.8);
  }

  const flow = state.pump_flow + (targetFlow - state.pump_flow) * 0.4 * dt;
  const pressure = state.pump_pressure + (targetPressure - state.pump_pressure) * 0.4 * dt;
  const ambient = 26.0;
  const targetTemp = ambient + (isPumpActive ? 14.0 * (flow / 65.0) : 0) + (hasPipeClog ? 12.0 : 0);
  const pumpTemp = state.pump_temp + (targetTemp - state.pump_temp) * 0.08 * dt;

  let pumpEfficiency = 0.0;
  if (flow > 5) {
    pumpEfficiency = 88.0 - (hasPipeClog ? 18.0 : 0.0) - Math.abs(65.0 - flow) * 0.15;
    pumpEfficiency = Math.max(55.0, Math.min(91.5, pumpEfficiency));
  }

  return {
    pump_flow: Number(flow.toFixed(1)),
    pump_pressure: Number(pressure.toFixed(2)),
    pump_temp: Number(pumpTemp.toFixed(1)),
    pump_efficiency: Number(pumpEfficiency.toFixed(1))
  };
}
