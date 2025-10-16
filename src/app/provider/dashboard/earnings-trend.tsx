
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useMemo } from "react"

interface Booking {
  id: string;
  date: Date;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface EarningsTrendProps {
  bookings: Booking[];
}

export default function EarningsTrend({ bookings }: EarningsTrendProps) {
  // Calculate earnings per month from real booking data
  const data = useMemo(() => {
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyEarnings: { name: string; total: number }[] = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthNames[targetDate.getMonth()];
      
      // Calculate earnings for this month from completed bookings
      const monthlyTotal = bookings
        .filter(booking => {
          const bookingDate = new Date(booking.date);
          return (
            booking.status === 'completed' &&
            bookingDate.getMonth() === targetDate.getMonth() &&
            bookingDate.getFullYear() === targetDate.getFullYear()
          );
        })
        .reduce((sum, booking) => sum + (booking.amount || 0), 0);

      monthlyEarnings.push({ name: monthName, total: monthlyTotal });
    }

    return monthlyEarnings;
  }, [bookings]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))'
          }}
          formatter={(value) => [`₹${value}`, 'Earnings']}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
