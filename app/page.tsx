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

  // state for toggles
  const [show1, setShow1] = useState(true);
  const [show7, setShow7] = useState(false);
  const [show30, setShow30] = useState(false);
  
  // fetch multi series
  useEffect(() => {
    if (itemCode == null || !stateSel) return;
    setLoading(true);
    const url = `/api/predict_multi?item_code=${itemCode}&state=${encodeURIComponent(stateSel)}`;
    fetch(url)
      .then(r => r.json())
      .then(d => {
        // keep {1:[...],7:[...],30:[...]}
        setSeries(d.series || {});
      })
      .finally(() => setLoading(false));
  }, [itemCode, stateSel]);
  
  // build datasets from toggles
  function buildDatasets() {
    const ds: any[] = [];
    const add = (label: string, arr: any[], color: string) => {
      if (!arr?.length) return;
      ds.push({
        label, data: arr.map((p: any) => ({ x: p.date, y: p.variance })),
        borderWidth: 2, tension: 0.2, pointRadius: 0, borderColor: color
      });
    };
    if (show1)  add("Next-day (1d)", series[1],  "#4e79a7");
    if (show7)  add("7 days ahead", series[7],  "#59a14f");
    if (show30) add("30 days ahead", series[30], "#e15759");
    return ds;
  }
  
  // chart render
  useEffect(() => {
    const el = document.getElementById("ts") as HTMLCanvasElement | null;
    if (!el) return;
    const chart = new Chart(el, {
      type: "line",
      data: { datasets: buildDatasets() },
      options: {
        responsive: true,
        parsing: false,
        plugins: { legend: { display: true } },
        scales: {
          x: { type: "time", time: { unit: "day" } },
          y: { beginAtZero: false }
        }
      }
    });
    return () => chart.destroy();
  }, [series, show1, show7, show30]);


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
          <div style={{ display: "flex", gap: 16 }}>
            <label><input type="checkbox" checked={show1} onChange={e=>setShow1(e.target.checked)} /> Next-day (1d)</label>
            <label><input type="checkbox" checked={show7} onChange={e=>setShow7(e.target.checked)} /> 7 days ahead</label>
            <label><input type="checkbox" checked={show30} onChange={e=>setShow30(e.target.checked)} /> 30 days ahead</label>
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
