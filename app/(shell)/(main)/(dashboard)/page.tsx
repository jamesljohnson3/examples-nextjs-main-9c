
"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search, User } from 'lucide-react';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';
import { deleteVehiclebyId } from '@/actions/dashboard';

export default function ProductListHomepage() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);

  useEffect(() => {
    async function fetchVehicles() {
      const vehicleData: VehicleRecord[] = await api.list();
      setVehicles(vehicleData);
    }
    fetchVehicles();
  }, []);

  const handleVehicleSelect = (vehicle: VehicleRecord) => {
    setSelectedVehicle(vehicle);
  };

  const extractProductId = (url: string) => {
    const parts = new URL(url).pathname.split('/');
    return parts[parts.length - 1].replace('.html', '');
  };

  const deleteVehicles = async (vehicleId: string) => {
    try {
      await deleteVehiclebyId(vehicleId); // Assuming `api.delete` is the correct method to delete a vehicle
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
      setSelectedVehicle(null); // Deselect the vehicle after deletion
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    deleteVehicles(vehicleId);
  };

  return (
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div className="text-muted-foreground">Dashboard / Vehicle List</div>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <User className="h-4 w-4 mr-1" />
                User
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/path/to/avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="mb-2">
        <CardContent className="p-2">
          <div className="flex space-x-2 mb-2">
            <Input placeholder="Type a command or search..." className="flex-grow h-8 text-xs" />
            <Button variant="outline" size="sm" className="h-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vehicle List</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {vehicles.map((vehicle) => (
                  <AccordionItem key={vehicle.id} value={vehicle.id}>
                    <AccordionTrigger onClick={() => handleVehicleSelect(vehicle)} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <img src={vehicle.fields.Attachments[0]?.thumbnails.small.url} alt={vehicle.fields.Name} className="w-8 h-8 object-cover rounded" />
                        <span>{vehicle.fields.Name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{vehicle.fields.Name}</h3>
                            <h3 className="font-semibold">Product ID: {extractProductId(vehicle.fields.Notes)}</h3>
                          </div>
                          <Badge>{vehicle.fields["Body type"]}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          {selectedVehicle && selectedVehicle.id === vehicle.id && (
                            <>
                              <a href={vehicle.fields.Notes} target="_blank" rel="noopener noreferrer">
                                <span className="text-xs text-blue-500 underline">This is the link to the live website</span>
                              </a>
                              <img src={vehicle.fields.Attachments[0]?.thumbnails.large.url} alt={vehicle.fields.Name} className="w-48 h-48 object-cover rounded mb-2" />
                            </>
                          )}
                          <Button size="sm" onClick={() => handleDeleteVehicle(vehicle.id)}>Delete Vehicle</Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </ResizablePanel>
        <ResizablePanel defaultSize={20}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Total Vehicles:</span>
                  <span className="font-bold">{vehicles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Categories:</span>
                  <span className="font-bold">{new Set(vehicles.map(v => v.fields["Body type"])).size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Avg. Price:</span>
                  <span className="font-bold">
                    {/* Placeholder for average price calculation */}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
