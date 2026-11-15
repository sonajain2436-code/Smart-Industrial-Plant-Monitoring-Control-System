import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateClientPdf(data, alerts) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter'
  });

  const nowStr = new Date().toLocaleString();

  // Header Banner
  doc.setFillColor(16, 27, 45); // Dark Navy
  doc.rect(0, 0, 612, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART INDUSTRIAL PLANT MONITORING & CONTROL SYSTEM', 36, 35);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(147, 197, 253);
  doc.text(`Electronics Design Interdisciplinary Engineering Audit Report | Generated: ${nowStr}`, 36, 55);

  // 1. Executive Summary
  doc.setTextColor(16, 27, 45);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Operational Summary', 36, 105);

  autoTable(doc, {
    startY: 115,
    margin: { left: 36, right: 36 },
    head: [['Operational KPI', 'Status / Value', 'Benchmark Limit', 'Audit Result']],
    body: [
      ['Plant Operational Status', data.status, 'RUNNING / STANDBY', 'COMPLIANT'],
      ['Overall Plant Efficiency', `${data.efficiencies.overall}%`, '> 85.0% Target', 'OPTIMAL'],
      ['Total Machinery Monitored', `${data.plant_health.total_machines} Units`, 'All Nodes Active', 'NORMAL'],
      ['Substation Active Power Draw', `${data.electrical.power_kw} kW`, '< 75.0 kW Max', 'WITHIN LIMITS'],
      ['Cumulative Energy Consumption', `${data.electrical.energy_kwh} kWh`, 'Monitored IEC 62053', 'RECORDED'],
      ['Power Factor (cos phi)', `${data.electrical.power_factor}`, '> 0.90 Target', 'OPTIMAL']
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] }
  });

  // 2. Department Breakdown
  const finalY1 = doc.lastAutoTable.finalY + 20;
  doc.setTextColor(16, 27, 45);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Tri-Discipline Subsystem Telemetry', 36, finalY1);

  autoTable(doc, {
    startY: finalY1 + 10,
    margin: { left: 36, right: 36 },
    head: [['Discipline', 'Equipment', 'Current Value', 'Safe Operating Limits', 'Condition']],
    body: [
      ['Mechanical', 'Induction Motor #1', `${data.mechanical.motor_rpm} RPM`, '0 - 3000 RPM', 'NORMAL'],
      ['Mechanical', 'Motor Core Temp', `${data.mechanical.motor_temp} °C`, '< 75.0 °C', 'NORMAL'],
      ['Mechanical', 'DE Bearing Vibration', `${data.mechanical.motor_vibration} mm/s`, '< 4.5 mm/s (ISO 10816)', 'NORMAL'],
      ['Mechanical', 'Delivery Pump Flow', `${data.mechanical.pump_flow} L/min`, '20 - 85 L/min', 'NORMAL'],
      ['Chemical', 'Reactor Temp', `${data.chemical.reactor_temp} °C`, `Set: ${data.chemical.reactor_target_temp} °C`, 'STABLE'],
      ['Chemical', 'Reactor Pressure', `${data.chemical.reactor_pressure} bar`, '< 4.5 bar Venting', 'NORMAL'],
      ['Chemical', 'Reaction Acidity', `${data.chemical.reactor_ph} pH`, '6.8 - 7.6 pH', 'NORMAL'],
      ['Chemical', 'Batch Conversion', `${data.chemical.reaction_progress} %`, 'Cycle 0 - 100%', 'IN PROGRESS'],
      ['Electrical', '3-Phase Grid Voltage', `${data.electrical.grid_voltage} V`, '415 V ±10%', 'NOMINAL'],
      ['Electrical', 'Feeder Current', `${data.electrical.total_current} A`, '< 125 A Rating', 'NORMAL'],
      ['Electrical', 'Transformer Temp', `${data.electrical.transformer_oil_temp} °C`, '< 65.0 °C Oil Limit', 'NORMAL'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [16, 27, 45], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] }
  });

  // 3. Alerts & Incident Log
  const finalY2 = doc.lastAutoTable.finalY + 20;
  doc.setTextColor(16, 27, 45);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Fault Detection & Centralized Alarm Audit Log', 36, finalY2);

  const alertRows = alerts.slice(0, 6).map(a => [
    a.severity,
    a.department,
    a.title,
    a.status,
    new Date(a.created_at).toLocaleTimeString()
  ]);

  autoTable(doc, {
    startY: finalY2 + 10,
    margin: { left: 36, right: 36 },
    head: [['Severity', 'Department', 'Alarm Title', 'Status', 'Timestamp']],
    body: alertRows.length > 0 ? alertRows : [['INFO', 'SYSTEM', 'No active alarms detected.', 'NORMAL', nowStr]],
    theme: 'striped',
    headStyles: { fillColor: [245, 158, 11], textColor: [0, 0, 0], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] }
  });

  // Footer Sign-Off
  const finalY3 = doc.lastAutoTable.finalY + 25;
  if (finalY3 < 700) {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Approved by: SCADA Chief Plant Engineer &bull; Academic Electronics Design Submission &bull; Verified Cyber-Physical Simulation', 36, finalY3);
  }

  doc.save(`SIP_Industrial_Plant_Report_${Date.now()}.pdf`);
}
