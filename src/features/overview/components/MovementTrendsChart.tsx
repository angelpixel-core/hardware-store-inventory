import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MovementTrendPoint } from "../types";

export interface MovementTrendsChartProps {
  data: MovementTrendPoint[];
  onViewInventory?: () => void;
}

export function MovementTrendsChart({
  data,
  onViewInventory,
}: MovementTrendsChartProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Flujo de Movimientos Recientes
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Volumen de unidades ingresadas vs. egresadas por fecha
          </p>
        </div>
        {onViewInventory && (
          <button
            onClick={onViewInventory}
            className="text-xs font-medium text-slate-600 transition hover:text-slate-900"
          >
            Ver Kardex →
          </button>
        )}
      </div>

      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            Sin movimientos registrados aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
              />
              <Bar
                name="Entradas (Compras/Recepción)"
                dataKey="purchases"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Salidas (Ventas)"
                dataKey="sales"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Ajustes de Stock"
                dataKey="adjustments"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
