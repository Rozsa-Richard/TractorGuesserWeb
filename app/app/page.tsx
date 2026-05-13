import GameLogic from "@/components/gameLogic";
import { Brand } from "@/types/brand";
import { Vehicle } from "@/types/vehicle";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const todayISO = new Date().toISOString().split('T')[0];
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: data, error} = await supabase.from('dailyVehicle').select('vehicles(*)').eq('day', todayISO).single();
  const { data: vehicles } = await supabase.from('vehicles').select(); 
  const { data: brands} = await supabase.from('brands').select();
  
  if (error || !data) {
    return (
      <div className="text-center mt-5 text-danger">
        <h3>There is an error with the connection!</h3>
        <p>Please, Try it later.</p>
      </div>
    );
  }
  const result = data as any;
  
  return (
    <main className="container pb-5">
      <h1 className="text-center mt-5 mb-4 fw-bold">Tractor Guesser</h1>
      <GameLogic 
        todaysVehicle={result?.vehicles} 
        defaultTractors={vehicles as Vehicle[]}
        brands={brands as Brand[]}
      />
    </main>
  );
};