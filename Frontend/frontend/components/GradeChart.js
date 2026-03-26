


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import styles from "../styles/dashboard.module.css"

export default function GradeChart({ data }) {
  if (!Array.isArray(data)) return null;

  return (
    <div className={styles.graf}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#fff", fontSize: 14 }}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Bar dataKey="grade" fill="#C76E00" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
