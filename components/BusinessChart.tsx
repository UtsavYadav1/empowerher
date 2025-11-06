'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', revenue: 2000, orders: 5 },
  { month: 'Feb', revenue: 3500, orders: 8 },
  { month: 'Mar', revenue: 2800, orders: 6 },
  { month: 'Apr', revenue: 4200, orders: 10 },
  { month: 'May', revenue: 3900, orders: 9 },
  { month: 'Jun', revenue: 4500, orders: 12 },
]

export default function BusinessChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#8b5cf6" />
        <Bar dataKey="orders" fill="#ec4899" />
      </BarChart>
    </ResponsiveContainer>
  )
}

