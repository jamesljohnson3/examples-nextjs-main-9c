const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function deleteVehiclebyId(vehicleId: string) {
    await delay(9000); // 2-second delay
  
    try {
    } catch (error) {
      console.error('Error fetching Pornhub data:', error);
      return null;
    }
  }
  