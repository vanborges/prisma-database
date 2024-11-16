import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface ChartComponentProps {
  entradas: number;
  saidas: number;
}

function ChartComponent({ entradas, saidas }: ChartComponentProps) {
  const chartData = [
    { name: "Entradas", value: entradas, fill: "#4CAF50" },
    { name: "Saídas", value: saidas, fill: "#F44336" },
  ];

  return (
    <BarChart width={400} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" name={"Valor"} fill="#8884d8" />
      {/* titulo do grafico */}
      
    </BarChart>
  );
}

export default ChartComponent;
