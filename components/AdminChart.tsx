'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', users: 800, courses: 35 },
  { month: 'Feb', users: 920, courses: 38 },
  { month: 'Mar', users: 1050, courses: 40 },
  { month: 'Apr', users: 1100, courses: 42 },
  { month: 'May', users: 1180, courses: 43 },
  { month: 'Jun', users: 1247, courses: 45 },
]

export default function AdminChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="users" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
        <Area type="monotone" dataKey="courses" stackId="2" stroke="#ec4899" fill="#ec4899" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

