"use server"

import { db } from "@/app/lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

export const getDayBookings = async (babershopId: string, date: Date) => {
  const bookings = await db.booking.findMany({
    where: {
      babershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });

  return bookings;
};
