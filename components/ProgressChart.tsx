'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', progress: 20 },
  { month: 'Feb', progress: 35 },
  { month: 'Mar', progress: 45 },
  { month: 'Apr', progress: 60 },
  { month: 'May', progress: 75 },
  { month: 'Jun', progress: 85 },
]

export default function ProgressChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="progress" stroke="#ec4899" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

