
"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { BarChart3Icon, ChevronLeft, Globe, MessageSquare, Search, User } from 'lucide-react';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';
import { deleteVehiclebyId } from '@/actions/dashboard';
import Link from 'next/link';
import AdvancedOptions from './edit';


const LoadingAnimation = () => (
    <div className="p-4 max-w-md mx-auto h-full flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="rounded-full bg-gray-200 h-20 w-20"></div>
      <div className="h-6 bg-gray-200 rounded"> </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-6 bg-gray-200 rounded col-span-3"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded"></div>
    </div>
  </div>
  
  
  );

interface SearchTermIndicatorProps {
    searchTerm: string;
    searchField: string;
    vehicles: VehicleRecord[];
  }
  
  const SearchTermIndicator: React.FC<SearchTermIndicatorProps> = ({ searchTerm, searchField, vehicles }) => {

    // Normalize the search term to only include numbers (useful for price searches)
    const normalizeSearchTerm = (term: string) => term.replace(/[^0-9.-]+/g, '');

    const isTermInField = (vehicle: VehicleRecord) => {
        const term = searchTerm.toLowerCase();
        const normalizedTerm = normalizeSearchTerm(term); // Normalize the search term
        const { fields } = vehicle;

        // Normalize the vehicle price field (Vehicle details 1) to only include numbers
        const priceNormalized = fields["Vehicle details 1"]?.replace(/[^0-9.-]+/g, '') || '';

        return (
            (searchField === "name" && fields.Name?.toLowerCase().includes(term)) ||
            (searchField === "notes" && fields.Notes?.toLowerCase().includes(term)) ||
            (searchField === "bodyType" && fields["Body type"]?.toLowerCase().includes(term)) ||
            (searchField === "price" && priceNormalized.includes(normalizedTerm)) || // Compare normalized price with normalized search term
            (searchField === "exteriorColor" && fields["Exterior Color"]?.toLowerCase().includes(term)) ||
            (searchField === "engine" && fields.Engine?.toLowerCase().includes(term)) ||
            (searchField === "vehicleDetails2" && fields["Vehicle details 2"]?.toLowerCase().includes(term)) ||
            (searchField === "drivetrain" && fields.Drivetrain?.toLowerCase().includes(term))
        );
    };

    const matchingVehicles = vehicles.filter(isTermInField);

    return (
        <>
            {searchTerm && (
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    Searching {matchingVehicles.length} vehicle(s) for {searchTerm} 
                  {/*by {searchField === "price" ? "Price" : searchField}: */} 
                </span>
            )}
        </>
    );
};


const LoadingIndicator: React.FC = () => (
  <div className="text-center">Loading vehicles...</div>
);

export const Header: React.FC = () => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
     <Link href={'/admin'}>
     <Button variant="ghost" size="sm" className="h-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Button>
     </Link>

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
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
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
);


interface SearchBarProps {
    setSearchTerm: (term: string) => void;
    searchTerm: string;
    searchField: string;
    setSearchField: (field: string) => void; // Added setter for search field
    vehicles: VehicleRecord[];
}
const SearchBar: React.FC<SearchBarProps> = ({ setSearchTerm, searchTerm, searchField, setSearchField, vehicles }) => {
    return (
        <Card className="mb-2">
            <CardContent className="p-2">
                <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2 mb-2">
                        <Input
                            placeholder="Type a command or search..."
                            className="flex-grow h-10 text-xs"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline" size="sm" className="h-10">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    {/* 
                     <div className="flex space-x-2">
                        <Button onClick={() => setSearchField("name")}>Search by Name</Button>
                        <Button onClick={() => setSearchField("notes")}>Search by Notes</Button>
                        <Button onClick={() => setSearchField("bodyType")}>Search by Body Type</Button>
                        <Button onClick={() => setSearchField("exteriorColor")}>Search by Exterior Color</Button>
                    </div>
                    Add buttons to change search fields */}
                   
                    <SearchTermIndicator searchTerm={searchTerm} searchField={searchField} vehicles={vehicles} />
                </div>
            </CardContent>
        </Card>
    );
};


// Add this prop to the VehicleItemProps
interface VehicleItemProps {
  vehicle: VehicleRecord;
  onDelete: (id: string) => void;
  onSelect: (vehicle: VehicleRecord) => void;
  selectedVehicle: VehicleRecord | null; // Add selectedVehicle prop
}

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onDelete, onSelect, selectedVehicle }) => {
    


  const extractProductId = (url: string) => {
    const parts = new URL(url).pathname.split('/');
    return parts[parts.length - 1].replace('.html', '');
  };

  return (
    <AccordionItem key={vehicle.id} value={vehicle.id}>
      <AccordionTrigger onClick={() => onSelect(vehicle)} className="text-xs">
        <div className="flex items-center space-x-2">
          <img src={vehicle.fields.Attachments[0]?.thumbnails.small.url} alt={vehicle.fields.Name} className="w-10 h-10 object-cover rounded" />
          <span>{vehicle.fields.Name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-2 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{vehicle.fields.Name}</h3>
              <p className="text-xs font-semibold">Product ID: {extractProductId(vehicle.fields.Notes)}</p>
            </div>
            <Badge>{vehicle.fields["Body type"]}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold">{vehicle.fields["Vehicle details 1"] || 0}</span>
            
          </div>
          {/* Conditional rendering based on selectedVehicle */}
          {selectedVehicle && selectedVehicle.id === vehicle.id && (
            <Card className="flex mt-2">
              <CardContent className="p-2">
                <h2 className="font-semibold mb-1">Live Product Preview</h2>
                <div className="bg-muted p-2 rounded space-y-1">
                  <img src={vehicle.fields.Attachments[0]?.thumbnails.large.url} alt={vehicle.fields.Name} className="h-96 object-cover rounded mb-2" />
                  
                  

                  <div className="text-xs">
                    <span className="font-semibold">Name:</span> {vehicle.fields.Name}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Price:</span> {vehicle.fields["Vehicle details 1"] || 0}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Category:</span> {vehicle.fields["Body type"]}
                  </div>
                </div>
              </CardContent>
              <div className="flex mx-auto gap-4 flex-col items-center justify-center space-x-2">
              <Button size="sm" onClick={() => onDelete(vehicle.id)}>Delete Product</Button>
              <a href={`/product/${extractProductId(vehicle.fields.Notes)}`}>
                <Button size="sm">Edit Product</Button>
              </a>
            </div>
            </Card>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

interface VehicleListProps {
    vehicles: VehicleRecord[];
    onDelete: (id: string) => void;
    onSelect: (vehicle: VehicleRecord) => void;
    loading: boolean;
    selectedVehicle: VehicleRecord | null; // Add selectedVehicle prop
  }
  
  const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onDelete, onSelect, loading, selectedVehicle }) => {
    if (loading) {
      return <LoadingIndicator />;
    }
  
    return (
      <Accordion type="single" collapsible className="w-full">
        {vehicles.map(vehicle => (
          <VehicleItem
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={onDelete}
            onSelect={onSelect}
            selectedVehicle={selectedVehicle} // Pass selectedVehicle prop
          />
        ))}
      </Accordion>
    );
  };
  

interface QuickStatsProps {
  vehicles: VehicleRecord[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ vehicles }) => {
    const total = vehicles.reduce((sum, v) => {
      const priceStr = v.fields["Vehicle details 1"];
      const price = Number(priceStr.replace(/[^0-9.-]+/g, '')); // Remove $ and other non-numeric characters
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
  
    const avgPrice = vehicles.length > 0
      ? (total / vehicles.length).toFixed(2)
      : '0.00';
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">Total Products:</span>
              <span className="font-bold">{vehicles.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Categories:</span>
              <span className="font-bold">{new Set(vehicles.map(v => v.fields["Body type"])).size}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Total Price:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">Avg. Price:</span>
              <span className="font-bold">${avgPrice}</span>
            </div>
          </div>

          
        </CardContent>
      </Card>
    );
  };
  

const ProductListHomepage: React.FC = () => {
    const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchField, setSearchField] = useState<string>("name"); // Default search field
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const term = debouncedSearchTerm.toLowerCase();
    const { fields } = vehicle;
  
    // Check against relevant fields
    return (
      fields.Name?.toLowerCase().includes(term) ||
      fields.Notes?.toLowerCase().includes(term) ||
      fields["Body type"]?.toLowerCase().includes(term) ||
      fields["Vehicle details 1"]?.toLowerCase().includes(term) ||
      fields["Exterior Color"]?.toLowerCase().includes(term) ||
      fields.Engine?.toLowerCase().includes(term) ||
      fields["Vehicle details 2"]?.toLowerCase().includes(term) ||
      fields.Drivetrain?.toLowerCase().includes(term) ||
      vehicle.preview?.toLowerCase().includes(term) // Check preview if necessary
    );
  });
  

    const handleVehicleSelect = (vehicle: VehicleRecord) => {
      setSelectedVehicle(prev => prev?.id === vehicle.id ? null : vehicle); // Toggle selection
    };
  
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const vehicleData: VehicleRecord[] = await api.list();
      setVehicles(vehicleData);
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  const deleteVehicles = async (vehicleId: string) => {
    try {
      await deleteVehiclebyId(vehicleId);
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      deleteVehicles(vehicleId);
    }
  };

  return (
    <div className=" w-full bg-white rounded-md mx-auto p-4 space-y-4 text-sm">
      <SearchBar
                vehicles={vehicles}
                setSearchTerm={setSearchTerm}
                searchField={searchField}
                setSearchField={setSearchField} // Pass down the setter
                searchTerm={searchTerm}
            />
      <ResizablePanelGroup className='space-x-2 space-y-2 gap-4' direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Segments / Inventory</CardTitle>
            </CardHeader>
            <CardContent>
            <VehicleList
                vehicles={filteredVehicles} // Use filtered vehicles
                onDelete={handleDeleteVehicle}
                onSelect={handleVehicleSelect}
                loading={loading}
                selectedVehicle={selectedVehicle}
              />
              
              </CardContent>
          </Card>

    <Suspense fallback={<LoadingAnimation/>}><AdvancedOptions/></Suspense>
        </ResizablePanel>
        <ResizablePanel className="hidden md:flex flex-col space-y-4" defaultSize={20}>
          <QuickStats vehicles={vehicles} />


          <Card className="col-span-3 bg-white backdrop-blur-lg border">
            <CardContent className="p-2">
            <nav className="space-y-1">
  {[
    { label: 'Add Listing', link: '/add-listing' },
    { label: 'Create Product', link: '/create-product' },
  ].map(({ label, link }) => (
    <Link key={label} href={link}>
      <Button variant="ghost" className="w-full justify-start text-xs py-1 px-2">
        {label}
      </Button>
    </Link>
  ))}
</nav>

            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProductListHomepage;
