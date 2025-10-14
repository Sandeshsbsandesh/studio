
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const appointments = [
    { name: "Srinivasan", service: "Electrician", time: "2:00 PM", avatar: "S" },
    { name: "John Doe", service: "Plumber", time: "4:30 PM", avatar: "JD" },
    { name: "Emily White", service: "Cleaner", time: "6:00 PM", avatar: "EW" },
]

export default function UpcomingAppointments() {
    if (appointments.length === 0) {
        return (
            <div className="flex items-center justify-center h-52 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No upcoming appointments.</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {appointments.map((appointment, index) => (
                 <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={`/avatars/${index + 1}.png`} alt="Avatar" />
                        <AvatarFallback>{appointment.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{appointment.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    </div>
                    <div className="ml-auto font-medium">{appointment.time}</div>
                </div>
            ))}
        </div>
    )
}
