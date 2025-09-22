"use client";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

export default function PriceChart({ series }:{series:{date:string; value:number}[]}) {
  const data={datasets:[{label:"Daily Average Price (RM)", data:series.map(d=>({x:d.date,y:d.value}))}]};
  const options:any={responsive:true, maintainAspectRatio:false, scales:{x:{type:"time", time:{unit:"day"}}}};
  return <div style={{height:360}}><Line data={data} options={options}/></div>;
}
