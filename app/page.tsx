"use client";

import { useEffect, useMemo, useState } from "react";
import { Chart, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from "chart.js";
import 'chartjs-adapter-date-fns';

Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

type Item = { code: number; name: string };

export default function Page() {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [itemCode, setItemCode] = useState<number | null>(null);
  const [stateSel, setStateSel] = useState<string>("");
  const [horizon, setHorizon] = useState<number>(1);
  const [series, setSeries] = useState<{ date: string; variance: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // load metadata
  useEffect(() => {
    fetch("/api/items").then(r => r.json()).then(d => {
      setItems(d.items);
      setStates(d.states);
      if (d.items?.length && itemCode === null) setItemCode(d.items[0].code);
      if (d.states?.length && !stateSel) setStateSel(d.states[0]);
    });
  }, []);

  // fetch series when selection changes
  useEffect(() => {
    if (itemCode == null || !stateSel) return;
    setLoading(true);
    const url = `/api/predict?item_code=${itemCode}&state=${encodeURIComponent(stateSel)}&horizon=${horizon}`;
    fetch(url).then(r => r.json()).then(d => setSeries(d.series || [])).finally(() => setLoading(false));
  }, [itemCode, stateSel, horizon]);

  // simple chart using <canvas>
  useEffect(() => {
    const el = document.getElementById("ts") as HTMLCanvasElement | null;
    if (!el) return;
    const chart = new Chart(el, {
      type: "line",
      data: {
        labels: series.map((p) => p.date),
        datasets: [{
          label: `Predicted variance (h=${horizon}d)`,
          data: series.map((p) => p.variance),
          borderWidth: 2,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          x: { type: "time", time: { unit: "day" } },
          y: { beginAtZero: false }
        }
      }
    });
    return () => chart.destroy();
  }, [series, horizon]);

  return (
    <main>
      <h1>Food Price Volatility — Hybrid LSTM + GARCH</h1>
      <div className="card" style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div>
            <label>Item</label><br/>
            <select value={itemCode ?? ""} onChange={e => setItemCode(parseInt(e.target.value))} style={{ width: "100%", padding: 8 }}>
              {items.map(it => <option key={it.code} value={it.code}>{it.name}</option>)}
            </select>
          </div>
          <div>
            <label>State</label><br/>
            <select value={stateSel} onChange={e => setStateSel(e.target.value)} style={{ width: "100%", padding: 8 }}>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Forecast horizon</label><br/>
            <select value={horizon} onChange={e => setHorizon(parseInt(e.target.value))} style={{ width: "100%", padding: 8 }}>
              <option value={1}>Next day (1d)</option>
              <option value={7}>7 days ahead</option>
              <option value={30}>30 days ahead</option>
            </select>
          </div>
        </div>

        <div style={{ minHeight: 360 }}>
          {loading ? <p>Loading…</p> : <canvas id="ts" height={120} />}
          {(!loading && series.length === 0) && <p>No data for this selection yet.</p>}
        </div>
      </div>
    </main>
  );
}
