import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { IntegratedSimulationEngine } from '../simulation/simulationEngine';
import * as api from '../services/api';

const PlantContext = createContext(null);

export function PlantProvider({ children }) {
  const engineRef = useRef(new IntegratedSimulationEngine());
  const [data, setData] = useState(engineRef.current.getSnapshot());
  const [history, setHistory] = useState(engineRef.current.history);
  const [alerts, setAlerts] = useState([
    { id: 1, department: 'MECHANICAL', severity: 'WARNING', title: 'Motor Vibration Elevated', message: 'Vibration sensor detected 3.8 mm/s RMS on Motor #1 drive end bearing.', status: 'RESOLVED', created_at: new Date(Date.now() - 45*60000).toISOString() },
    { id: 2, department: 'ELECTRICAL', severity: 'WARNING', title: 'Phase Imbalance Detected', message: 'Grid supply phase L2 voltage dropped 3.2% below nominal threshold.', status: 'RESOLVED', created_at: new Date(Date.now() - 30*60000).toISOString() },
    { id: 3, department: 'CHEMICAL', severity: 'WARNING', title: 'Reagent Tank B Low Warning', message: 'Reagent Tank B level reached 24% capacity. Restock scheduled.', status: 'ACTIVE', created_at: new Date(Date.now() - 10*60000).toISOString() },
  ]);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('sip_theme') || 'dark');
  const [simSpeed, setSimSpeed] = useState(1.0);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sip_theme', theme);
  }, [theme]);

  // Main simulation & sync loop (runs every 1.5s)
  useEffect(() => {
    const interval = setInterval(async () => {
      // 1. Attempt to fetch from Flask Backend
      let backendData = null;
      try {
        backendData = await api.fetchPlantStatus();
      } catch (e) {
        backendData = null;
      }

      if (backendData && backendData.status) {
        setIsLiveBackend(true);
        setData(backendData);
        // Sync alerts from backend
        const backendAlerts = await api.fetchAlerts();
        if (backendAlerts && Array.isArray(backendAlerts)) {
          setAlerts(backendAlerts);
        }
        // Update local history
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setHistory(prev => {
          const next = [...prev, {
            time: nowStr,
            motor_rpm: backendData.mechanical.motor_rpm,
            pump_flow: backendData.mechanical.pump_flow,
            reactor_temp: backendData.chemical.reactor_temp,
            power_kw: backendData.electrical.power_kw,
            overall_eff: backendData.efficiencies.overall,
            mech_eff: backendData.efficiencies.mechanical,
            chem_eff: backendData.efficiencies.chemical,
            elec_eff: backendData.efficiencies.electrical,
            voltage: backendData.electrical.grid_voltage,
            current: backendData.electrical.total_current,
          }];
          return next.slice(-30);
        });
      } else {
        // Fallback to client-side engine tick
        setIsLiveBackend(false);
        const snapshot = engineRef.current.tick(1.5 * simSpeed);
        setData(snapshot);
        setHistory([...engineRef.current.history]);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [simSpeed]);

  // Controls
  const startPlant = async () => {
    engineRef.current.state.status = 'RUNNING';
    engineRef.current.state.emergency_stopped = false;
    engineRef.current.state.motor_enabled = true;
    engineRef.current.state.pump_enabled = true;
    engineRef.current.state.reactor_enabled = true;
    engineRef.current.state.breaker_main_closed = true;
    engineRef.current.state.breaker_motor_closed = true;
    engineRef.current.state.breaker_reactor_closed = true;
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('START_PLANT');
  };

  const stopPlant = async () => {
    engineRef.current.state.status = 'STOPPED';
    engineRef.current.state.motor_enabled = false;
    engineRef.current.state.pump_enabled = false;
    engineRef.current.state.reactor_enabled = false;
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('STOP_PLANT');
  };

  const emergencyStop = async () => {
    engineRef.current.state.status = 'EMERGENCY_STOP';
    engineRef.current.state.emergency_stopped = true;
    engineRef.current.state.motor_enabled = false;
    engineRef.current.state.pump_enabled = false;
    engineRef.current.state.reactor_enabled = false;
    engineRef.current.state.breaker_motor_closed = false;
    engineRef.current.state.breaker_reactor_closed = false;
    
    // Add local alert
    setAlerts(prev => [
      {
        id: Date.now(),
        department: 'INTEGRATED',
        severity: 'CRITICAL',
        title: 'EMERGENCY STOP ACTIVATED',
        message: 'Manual Emergency Stop tripped by Operator. Mechanical pumps and chemical feed instantly de-energized.',
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('EMERGENCY_STOP');
  };

  const resetSystem = async () => {
    engineRef.current.state.status = 'STOPPED';
    engineRef.current.state.emergency_stopped = false;
    engineRef.current.state.active_faults = [];
    engineRef.current.state.breaker_main_closed = true;
    engineRef.current.state.breaker_motor_closed = true;
    engineRef.current.state.breaker_reactor_closed = true;
    engineRef.current.state.reactor_temp = 35.0;
    engineRef.current.state.reactor_pressure = 1.2;
    engineRef.current.state.reaction_progress = 0.0;
    
    setAlerts(prev => [
      {
        id: Date.now(),
        department: 'INTEGRATED',
        severity: 'INFO',
        title: 'Safety Interlocks Reset',
        message: 'All department safety trips acknowledged and reset. Plant in standby.',
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      },
      ...prev
    ]);

    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('RESET_SYSTEM');
  };

  const setMotorRpm = async (rpm) => {
    engineRef.current.state.motor_target_rpm = Number(rpm);
    if (Number(rpm) > 0 && !engineRef.current.state.emergency_stopped) {
      engineRef.current.state.motor_enabled = true;
    }
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('SET_MOTOR_RPM', { rpm });
  };

  const toggleMotor = async () => {
    const next = !engineRef.current.state.motor_enabled;
    engineRef.current.state.motor_enabled = next;
    if (!next) engineRef.current.state.motor_target_rpm = 0;
    else if (engineRef.current.state.motor_target_rpm === 0) engineRef.current.state.motor_target_rpm = 1480;
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('TOGGLE_MOTOR', { enabled: next });
  };

  const setPumpFlow = async (flow) => {
    engineRef.current.state.pump_target_flow = Number(flow);
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('SET_PUMP_FLOW', { flow });
  };

  const togglePump = async () => {
    const next = !engineRef.current.state.pump_enabled;
    engineRef.current.state.pump_enabled = next;
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('TOGGLE_PUMP', { enabled: next });
  };

  const setReactorTemp = async (temp) => {
    engineRef.current.state.reactor_target_temp = Number(temp);
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('SET_REACTOR_TEMP', { temp });
  };

  const setMixingSpeed = async (rpm) => {
    engineRef.current.state.reactor_mixing_rpm = Number(rpm);
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('SET_MIXING_SPEED', { rpm });
  };

  const toggleReactor = async () => {
    const next = !engineRef.current.state.reactor_enabled;
    engineRef.current.state.reactor_enabled = next;
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('TOGGLE_REACTOR', { enabled: next });
  };

  const toggleBreaker = async (breaker) => {
    if (breaker === 'main') {
      const next = !engineRef.current.state.breaker_main_closed;
      engineRef.current.state.breaker_main_closed = next;
      if (!next) {
        engineRef.current.state.motor_enabled = false;
        engineRef.current.state.pump_enabled = false;
        engineRef.current.state.reactor_enabled = false;
      }
    } else if (breaker === 'motor') {
      engineRef.current.state.breaker_motor_closed = !engineRef.current.state.breaker_motor_closed;
    } else if (breaker === 'reactor') {
      engineRef.current.state.breaker_reactor_closed = !engineRef.current.state.breaker_reactor_closed;
    }
    setData(engineRef.current.getSnapshot());
    await api.sendPlantControl('TOGGLE_BREAKER', { breaker });
  };

  const injectFault = async (faultType) => {
    if (!engineRef.current.state.active_faults.includes(faultType)) {
      engineRef.current.state.active_faults.push(faultType);
      
      const titles = {
        BEARING_FAULT: { dept: 'MECHANICAL', sev: 'CRITICAL', title: 'Severe Motor Bearing Degradation', msg: 'ISO 10816 vibration exceeded 6.8 mm/s. Bearing inner race fault simulated.' },
        VOLTAGE_SAG: { dept: 'ELECTRICAL', sev: 'WARNING', title: 'Grid Supply Voltage Sag', msg: 'Substation bus voltage dropped to 348V (-16% under-voltage condition).' },
        OVERCURRENT: { dept: 'ELECTRICAL', sev: 'CRITICAL', title: 'MCC Panel Feeder Overcurrent', msg: 'Feeder breaker current spiked past 135A rating.' },
        PIPE_CLOG: { dept: 'MECHANICAL', sev: 'WARNING', title: 'Centrifugal Pump Line Clog', msg: 'Discharge pressure surged to 5.8 bar with immediate 35% flow reduction.' },
        REACTOR_EXOTHERM: { dept: 'CHEMICAL', sev: 'CRITICAL', title: 'Exothermic Runaway in Reactor', msg: 'Reaction enthalpy generation rate exceeded cooling jacket thermal capacity.' },
        PH_ACID_SPIKE: { dept: 'CHEMICAL', sev: 'WARNING', title: 'Reactor Severe Acidification', msg: 'pH level dropped sharply to 4.1. Neutralizing base valve interlock needed.' },
        POWER_OUTAGE: { dept: 'ELECTRICAL', sev: 'CRITICAL', title: 'Main Substation Grid Blackout', msg: 'Incoming 11kV/415V transformer lost utility feed. Complete plant trip.' }
      };

      const info = titles[faultType] || { dept: 'INTEGRATED', sev: 'WARNING', title: 'Simulated Fault Active', msg: `Fault ${faultType} injected.` };

      setAlerts(prev => [
        {
          id: Date.now(),
          department: info.dept,
          severity: info.sev,
          title: info.title,
          message: info.msg,
          status: 'ACTIVE',
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
    }

    setData(engineRef.current.getSnapshot());
    await api.injectSimFault(faultType);
  };

  const clearFault = async (faultType = null) => {
    if (faultType) {
      engineRef.current.state.active_faults = engineRef.current.state.active_faults.filter(f => f !== faultType);
    } else {
      engineRef.current.state.active_faults = [];
    }
    setData(engineRef.current.getSnapshot());
    await api.clearSimFault(faultType);
  };

  const acknowledgeAlert = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'ACKNOWLEDGED', acknowledged_at: new Date().toISOString() } : a));
    await api.ackAlert(id);
  };

  const resolveAlert = async (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED', resolved_at: new Date().toISOString() } : a));
    await api.resAlert(id);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <PlantContext.Provider value={{
      data,
      history,
      alerts,
      activeFaults: data.active_faults || [],
      isLiveBackend,
      theme,
      simSpeed,
      setSimSpeed,
      toggleTheme,
      startPlant,
      stopPlant,
      emergencyStop,
      resetSystem,
      setMotorRpm,
      toggleMotor,
      setPumpFlow,
      togglePump,
      setReactorTemp,
      setMixingSpeed,
      toggleReactor,
      toggleBreaker,
      injectFault,
      clearFault,
      acknowledgeAlert,
      resolveAlert,
    }}>
      {children}
    </PlantContext.Provider>
  );
}

export function usePlant() {
  const context = useContext(PlantContext);
  if (!context) throw new Error('usePlant must be used within a PlantProvider');
  return context;
}
