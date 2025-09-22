"use client";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

export default function VolatilityChart({
  series7, series30
}:{series7?:{date:string; value:number}[], series30?:{date:string; value:number}[]}) {
  const datasets:any=[];
  if (series7?.length)  datasets.push({label:"7-day rolling volatility (RM)", data:series7.map(d=>({x:d.date,y:d.value}))});
  if (series30?.length) datasets.push({label:"30-day rolling volatility (RM)", data:series30.map(d=>({x:d.date,y:d.value}))});
  const data={datasets};
  const options:any={responsive:true, maintainAspectRatio:false, scales:{x:{type:"time", time:{unit:"day"}}}};
  return <div style={{height:360}}><Line data={data} options={options}/></div>;
}
