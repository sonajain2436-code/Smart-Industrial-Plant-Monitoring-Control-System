import sqlite3
import os
import json
import time
from datetime import datetime, timedelta
import random

DB_PATH = os.path.join(os.path.dirname(__file__), 'plant_data.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Telemetry history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS telemetry_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            motor_rpm REAL,
            motor_temp REAL,
            motor_vibration REAL,
            pump_flow REAL,
            pump_pressure REAL,
            tank_a_level REAL,
            tank_b_level REAL,
            tank_c_level REAL,
            reactor_temp REAL,
            reactor_pressure REAL,
            reactor_ph REAL,
            reaction_progress REAL,
            voltage REAL,
            current REAL,
            power_kw REAL,
            energy_kwh REAL,
            power_factor REAL,
            frequency REAL,
            eff_mech REAL,
            eff_chem REAL,
            eff_elec REAL,
            eff_overall REAL,
            plant_status TEXT
        )
    ''')

    # Alerts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department TEXT NOT NULL,
            severity TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            created_at TEXT NOT NULL,
            acknowledged_at TEXT,
            resolved_at TEXT
        )
    ''')

    # System Settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    ''')

    conn.commit()

    # Seed default settings if empty
    cursor.execute('SELECT COUNT(*) FROM settings')
    if cursor.fetchone()[0] == 0:
        default_settings = {
            "motor_max_rpm": 3000,
            "motor_temp_warn": 75.0,
            "motor_temp_crit": 90.0,
            "vibration_warn": 4.5,
            "vibration_crit": 7.0,
            "pump_min_flow": 15.0,
            "pump_max_pressure": 6.5,
            "reactor_temp_warn": 85.0,
            "reactor_temp_crit": 105.0,
            "reactor_max_press": 4.5,
            "ph_min": 6.0,
            "ph_max": 8.5,
            "voltage_nom": 415.0,
            "voltage_tolerance_pct": 10.0,
            "current_max": 125.0,
            "weight_mech": 0.35,
            "weight_chem": 0.35,
            "weight_elec": 0.30,
            "sim_speed": 1.0
        }
        for k, v in default_settings.items():
            cursor.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (k, json.dumps(v)))
        conn.commit()

    # Seed initial alerts if empty
    cursor.execute('SELECT COUNT(*) FROM alerts')
    if cursor.fetchone()[0] == 0:
        now_iso = datetime.now().isoformat()
        initial_alerts = [
            ("MECHANICAL", "WARNING", "Motor Vibration Elevated", "Vibration sensor detected 3.8 mm/s RMS on Motor #1 drive end bearing.", "RESOLVED", (datetime.now() - timedelta(minutes=45)).isoformat()),
            ("ELECTRICAL", "WARNING", "Phase Imbalance Detected", "Grid supply phase L2 voltage dropped 3.2% below nominal threshold.", "RESOLVED", (datetime.now() - timedelta(minutes=30)).isoformat()),
            ("CHEMICAL", "INFO", "Reagent Tank B Low Warning", "Reagent Tank B level reached 24% capacity. Restock scheduled.", "ACTIVE", (datetime.now() - timedelta(minutes=10)).isoformat()),
        ]
        for dept, sev, title, msg, status, ts in initial_alerts:
            cursor.execute('''
                INSERT INTO alerts (department, severity, title, message, status, created_at, resolved_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (dept, sev, title, msg, status, ts, ts if status == 'RESOLVED' else None))
        conn.commit()

    # Seed historical telemetry for analytics if empty
    cursor.execute('SELECT COUNT(*) FROM telemetry_history')
    if cursor.fetchone()[0] < 50:
        seed_historical_telemetry(cursor)
        conn.commit()

    conn.close()

def seed_historical_telemetry(cursor):
    """Seed 72 hours of realistic plant operational records."""
    now = datetime.now()
    base_kwh = 12450.0
    for i in range(120, 0, -1):
        ts = (now - timedelta(minutes=i * 30)).isoformat()
        # Realistic diurnal pattern + industrial operating states
        hour = (now - timedelta(minutes=i * 30)).hour
        load_factor = 0.85 + 0.12 * (1.0 if 8 <= hour <= 19 else 0.6) + random.uniform(-0.03, 0.03)
        
        rpm = 1450.0 * load_factor + random.uniform(-15, 15)
        flow = 65.0 * load_factor + random.uniform(-1.5, 1.5)
        pump_press = 3.8 * (rpm / 1450.0)**1.8 + random.uniform(-0.1, 0.1)
        m_temp = 58.0 + 18.0 * load_factor + random.uniform(-1, 1)
        m_vib = 1.8 + 1.2 * (rpm / 1500.0) + random.uniform(-0.2, 0.2)
        
        r_temp = 72.0 + 8.0 * load_factor + random.uniform(-1, 1)
        r_press = 2.4 + 0.5 * load_factor + random.uniform(-0.1, 0.1)
        r_ph = 7.1 + random.uniform(-0.3, 0.3)
        prog = (i % 20) * 5.0
        
        volt = 415.0 + random.uniform(-3.5, 3.5)
        curr = 68.0 * load_factor + random.uniform(-2, 2)
        pf = 0.94 + random.uniform(-0.02, 0.02)
        p_kw = (1.732 * volt * curr * pf) / 1000.0
        base_kwh += (p_kw * 0.5)
        
        eff_mech = min(96.0, max(75.0, 89.0 + random.uniform(-2.5, 2.5)))
        eff_chem = min(98.0, max(78.0, 91.5 + random.uniform(-3.0, 2.0)))
        eff_elec = min(97.0, max(82.0, 93.0 + random.uniform(-1.8, 1.8)))
        eff_overall = round(0.35 * eff_mech + 0.35 * eff_chem + 0.30 * eff_elec, 1)

        cursor.execute('''
            INSERT INTO telemetry_history (
                timestamp, motor_rpm, motor_temp, motor_vibration, pump_flow, pump_pressure,
                tank_a_level, tank_b_level, tank_c_level, reactor_temp, reactor_pressure,
                reactor_ph, reaction_progress, voltage, current, power_kw, energy_kwh,
                power_factor, frequency, eff_mech, eff_chem, eff_elec, eff_overall, plant_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            ts, round(rpm, 1), round(m_temp, 1), round(m_vib, 2), round(flow, 1), round(pump_press, 2),
            round(68.0 + random.uniform(-8, 8), 1), round(45.0 + random.uniform(-6, 6), 1), round(82.0 + random.uniform(-5, 5), 1),
            round(r_temp, 1), round(r_press, 2), round(r_ph, 2), round(prog, 1),
            round(volt, 1), round(curr, 1), round(p_kw, 2), round(base_kwh, 1),
            round(pf, 3), round(50.0 + random.uniform(-0.08, 0.08), 2),
            round(eff_mech, 1), round(eff_chem, 1), round(eff_elec, 1), eff_overall,
            'RUNNING' if load_factor > 0.6 else 'STANDBY'
        ))

def log_telemetry(record):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO telemetry_history (
            timestamp, motor_rpm, motor_temp, motor_vibration, pump_flow, pump_pressure,
            tank_a_level, tank_b_level, tank_c_level, reactor_temp, reactor_pressure,
            reactor_ph, reaction_progress, voltage, current, power_kw, energy_kwh,
            power_factor, frequency, eff_mech, eff_chem, eff_elec, eff_overall, plant_status
        ) VALUES (
            :timestamp, :motor_rpm, :motor_temp, :motor_vibration, :pump_flow, :pump_pressure,
            :tank_a_level, :tank_b_level, :tank_c_level, :reactor_temp, :reactor_pressure,
            :reactor_ph, :reaction_progress, :voltage, :current, :power_kw, :energy_kwh,
            :power_factor, :frequency, :eff_mech, :eff_chem, :eff_elec, :eff_overall, :plant_status
        )
    ''', record)
    conn.commit()
    conn.close()

def get_telemetry(limit=60, interval_mins=None):
    conn = get_db()
    cursor = conn.cursor()
    if interval_mins:
        cutoff = (datetime.now() - timedelta(minutes=interval_mins)).isoformat()
        cursor.execute('SELECT * FROM telemetry_history WHERE timestamp >= ? ORDER BY timestamp ASC', (cutoff,))
    else:
        cursor.execute('SELECT * FROM telemetry_history ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    result = [dict(row) for row in rows]
    if not interval_mins:
        result.reverse()
    return result

def get_alerts(status_filter=None, department_filter=None):
    conn = get_db()
    cursor = conn.cursor()
    query = 'SELECT * FROM alerts WHERE 1=1'
    params = []
    if status_filter:
        query += ' AND status = ?'
        params.append(status_filter.upper())
    if department_filter:
        query += ' AND department = ?'
        params.append(department_filter.upper())
    query += ' ORDER BY id DESC LIMIT 100'
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def insert_alert(department, severity, title, message):
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO alerts (department, severity, title, message, status, created_at)
        VALUES (?, ?, ?, ?, 'ACTIVE', ?)
    ''', (department.upper(), severity.upper(), title, message, now_iso))
    alert_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return alert_id

def acknowledge_alert(alert_id):
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        UPDATE alerts SET status = 'ACKNOWLEDGED', acknowledged_at = ?
        WHERE id = ? AND status = 'ACTIVE'
    ''', (now_iso, alert_id))
    conn.commit()
    conn.close()

def resolve_alert(alert_id):
    conn = get_db()
    cursor = conn.cursor()
    now_iso = datetime.now().isoformat()
    cursor.execute('''
        UPDATE alerts SET status = 'RESOLVED', resolved_at = ?
        WHERE id = ?
    ''', (now_iso, alert_id))
    conn.commit()
    conn.close()

def get_settings():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT key, value FROM settings')
    rows = cursor.fetchall()
    conn.close()
    result = {}
    for r in rows:
        try:
            result[r['key']] = json.loads(r['value'])
        except Exception:
            result[r['key']] = r['value']
    return result

def update_settings(new_settings):
    conn = get_db()
    cursor = conn.cursor()
    for k, v in new_settings.items():
        cursor.execute('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', (k, json.dumps(v)))
    conn.commit()
    conn.close()
    return get_settings()
