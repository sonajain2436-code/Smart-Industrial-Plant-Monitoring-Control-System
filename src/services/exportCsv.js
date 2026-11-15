export function generateClientCsv(history) {
  if (!history || history.length === 0) {
    alert("No history records available to export.");
    return;
  }

  const headers = Object.keys(history[0]).join(',');
  const rows = history.map(item => Object.values(item).join(',')).join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `SIP_Plant_Telemetry_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
