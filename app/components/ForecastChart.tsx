"use client";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

export default function ForecastChart({
  history, path, label
}:{history:{date:string; variance:number}[], path:{date:string; variance:number}[], label:string}) {
  const data = {
    datasets: [
      { label:"Historical variance", data:history.map(d=>({x:d.date,y:d.variance})) },
      { label, data:path.map(d=>({x:d.date,y:d.variance})), borderDash:[6,4] }
    ]
  };
  const options:any={responsive:true, maintainAspectRatio:false, scales:{x:{type:"time", time:{unit:"day"}}}};
  return <div style={{height:360}}><Line data={data} options={options}/></div>;
}
