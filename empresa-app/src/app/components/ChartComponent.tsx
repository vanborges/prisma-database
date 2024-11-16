import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from "recharts";

function ChartComponent() {
  const chartData = [
    { name: "Entradas", value: 2000, fill: "#4CAF50" },
    { name: "Saídas", value: 500, fill: "#F44336" },
  ];

  return (
    <BarChart width={400} height={300} data={chartData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
}

export default ChartComponent;
