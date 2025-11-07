'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BusinessChartProps {
  sellerId?: number
}

export default function BusinessChart({ sellerId }: BusinessChartProps) {
  const [data, setData] = useState<any[]>([
    { month: 'No Data', revenue: 0, orders: 0 }
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sellerId) {
      fetchChartData()
    }
  }, [sellerId])

  const fetchChartData = async () => {
    try {
      const response = await fetch(`/api/women/analytics?sellerId=${sellerId}`)
      const result = await response.json()
      
      if (result.success && result.data.revenueByMonth.length > 0) {
        // Combine revenue data with order counts
        const chartData = result.data.revenueByMonth.map((item: any) => ({
          month: item.month,
          revenue: item.revenue || 0,
          orders: item.orders || 0
        }))
        setData(chartData)
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
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue (₹)" />
        <Bar dataKey="orders" fill="#ec4899" name="Orders" />
      </BarChart>
    </ResponsiveContainer>
  )
}

