'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts'

interface ChartData {
  month: string
  users: number
  orders: number
  revenue: number
}

interface AdminChartProps {
  type?: 'area' | 'line' | 'bar'
}

export default function AdminChart({ type = 'area' }: AdminChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      
      if (result.success && result.data.monthlyData) {
        setData(result.data.monthlyData)
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-gray-500 dark:text-gray-400">Loading real-time data...</div>
      </div>
    )
  }

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }} 
          />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} name="Users" />
          <Line type="monotone" dataKey="orders" stroke="#ec4899" strokeWidth={3} name="Orders" />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#F3F4F6'
            }} 
          />
          <Legend />
          <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
          <Bar dataKey="orders" fill="#f59e0b" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="month" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: 'none', 
            borderRadius: '8px',
            color: '#F3F4F6'
          }} 
        />
        <Legend />
        <Area type="monotone" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" name="Users" />
        <Area type="monotone" dataKey="orders" stroke="#ec4899" fillOpacity={1} fill="url(#colorOrders)" name="Orders" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

