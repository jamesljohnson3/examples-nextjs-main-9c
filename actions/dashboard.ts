const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function deleteVehiclebyId(vehicleId: string) {
    await delay(2000); // 2-second delay

    try {
        const response = await fetch('https://celonis-88gmud.eu-1.celonis.cloud/ems-automation/public/api/root/45682a84-4866-458a-a18b-091a446dbc15/hook/2ybueg994epaeqcsnwawau1q89jy79kb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: vehicleId }), // Sending vehicle ID in the body
        });

        if (!response.ok) {
            throw new Error(`Failed to delete vehicle: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Deleted:', data);
        return data || null;
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return null;
    }
}
