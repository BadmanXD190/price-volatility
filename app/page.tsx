"use client";
import "./globals.css";
import useSWR from "swr";
import { useMemo, useState } from "react";
import Controls from "./components/Controls";
import PriceChart from "./components/PriceChart";
import VolatilityChart from "./components/VolatilityChart";
import ForecastChart from "./components/ForecastChart";

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function Page() {
  const { data: meta } = useSWR("/api/metadata", fetcher);
  const [sel, setSel] = useState({ item_code: 1, state: "Johor", horizon: 1 });

  const { data: path } = useSWR(
    () => `/api/predictions/path?item_code=${sel.item_code}&state=${encodeURIComponent(sel.state)}`,
    fetcher
  );

  const forecastPath = useMemo(()=>{
    if (!path) return [];
    return path
      .filter((r:any)=>r.horizon <= sel.horizon)
      .map((r:any)=>({ date:r.target_date, variance:r.var_pred_hybrid ?? r.var_pred_garch }));
  }, [path, sel.horizon]);

  return (
    <main>
      <h1>Food Price Volatility — Hybrid LSTM + GARCH</h1>

      {meta ? (
        <Controls items={meta.items} states={meta.states} value={sel} onChange={setSel} />
      ) : <div className="card">Loading metadata…</div>}

      <section className="card">
        <h2>Daily Average Price</h2>
        <PriceChart series={[]} />
      </section>

      <section className="card">
        <h2>Volatility Features</h2>
        <VolatilityChart series7={[]} series30={[]} />
      </section>

      <section className="card">
        <h2>Volatility Forecast</h2>
        <ForecastChart
          history={[]}  
          path={forecastPath}
          label={`Forecast path (next ${sel.horizon} days)`}
        />
      </section>
    </main>
  );
}
