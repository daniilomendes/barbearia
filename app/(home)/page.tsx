import { ptBR } from "date-fns/locale";
import Header from "../_components/header";
import { format } from "date-fns";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { Key } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershop, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),
    session?.user
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5">
        <h2 className="text-xl font-bold">
          {session?.user
            ? `Olá, ${session.user.name?.split(" ")[0]}!`
            : "Olá! Vamos agendar um corte hoje?"}
        </h2>
        <p className=" capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'de' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">
              Agendamentos
            </h2>
            <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map(
                (booking: { id: Key | null | undefined }) => (
                  <BookingItem key={booking.id} booking={booking} />
                )
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xs px-5 uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop: { id: Key | null | undefined }) => (
            <div key={barbershop.id} className="w-full max-w-[167px]">
              <BarbershopItem  barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 mb-2">
        <h2 className="text-xs px-5 uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershop.map((barbershop: { id: Key | null | undefined }) => (
            <div key={barbershop.id} className="w-full max-w-[167px]">
              <BarbershopItem  barbershop={barbershop} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
