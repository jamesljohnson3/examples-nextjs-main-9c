
"use client"
import  React, { useEffect, useState } from "react";
import type { XVideosResponse, YouPornResponse, PornhubVideo, PornhubResponse, VideoData } from "@/actions/home";
import { ListMusic, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "../components/ui/context-menu";
import { Separator } from "../components/ui/separator";
import Link from "next/link";
 



// HomeSection Component
export function HomeSection({ fetchXVideosData }: { fetchXVideosData: () => XVideosResponse | null }) {
  const [data, setData] = useState<XVideosResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const localData = localStorage.getItem("xvideosData");
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        const response = await fetchXVideosData(); // Fetch data asynchronously
        if (response) {
          localStorage.setItem("xvideosData", JSON.stringify(response));
          setData(response);
        }
      }
    };

    loadData(); // Call async function inside useEffect
  }, [fetchXVideosData]);

  if (!data) return <p>No data available</p>;

  const madeForYouVideo: VideoData = data.data;
  return <AlbumArtwork video={madeForYouVideo} className="w-[150px]" aspectRatio={1 / 1} />;
}

// ImageSection Component
export function ImageSection({ fetchYouPornData }: { fetchYouPornData: () => YouPornResponse | null }) {
  const [data, setData] = useState<YouPornResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const localData = localStorage.getItem("youpornData");
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        const response = await fetchYouPornData(); // Fetch data asynchronously
        if (response) {
          localStorage.setItem("youpornData", JSON.stringify(response));
          setData(response);
        }
      }
    };

    loadData(); // Call async function inside useEffect
  }, [fetchYouPornData]);

  if (!data) return <p>No data available</p>;

  const imageItems: string[] = data.assets;
  return (
    <>
      {imageItems.map((image, index) => (
        <div key={index} className="w-[150px] min-w-[150px]">
          <img src={image} alt={`Image ${index}`} className="object-cover transition-all hover:scale-105" />
        </div>
      ))}
    </>
  );
}
// PornhubSection Component
export function PornhubSection({ data }: { data: PornhubResponse | null }) {
  const [fetchData, setFetchData] = useState<PornhubResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Check if data is already in localStorage
      const cachedData = localStorage.getItem('pornhubData');
      if (cachedData) {
        setFetchData(JSON.parse(cachedData));
      } else {
        // Fetch data from API
        try {
          const response = await fetch('https://lust.scathach.id/pornhub/search?key=ebony');
          if (!response.ok) {
            throw new Error(`Failed to fetch Pornhub data: ${response.statusText}`);
          }
          const fetchedData: PornhubResponse = await response.json();
          // Store data in localStorage
          localStorage.setItem('pornhubData', JSON.stringify(fetchedData));
          setFetchData(fetchedData);
        } catch (error) {
          console.error('Error fetching Pornhub data:', error);
        }
      }
    };

    loadData();
  }, []);

  // Use the data prop if available, otherwise use the fetched data
  const effectiveData = data || fetchData;

  if (!effectiveData) return <p>Loading...</p>;
  if (!effectiveData.data || effectiveData.data.length === 0) return <p>No data available</p>;

  const pornhubVideos: PornhubVideo[] = effectiveData.data;

  return (
    <>
      {pornhubVideos.map((video) => (
        <div key={video.id} className="w-[150px] min-w-[150px]">
          <Link href={video.link} passHref>
            <a target="_blank">
              <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-md">
                <img src={video.image} alt={video.title} className="object-cover transition-all hover:scale-105" />
              </AspectRatio>
              <div className="space-y-1 text-sm mt-2">
                <h3 className="font-medium hidden leading-none">{video.title}</h3>
                <p className="text-xs text-slate-500 hidden dark:text-slate-400">
                  {video.duration} - {video.views}
                </p>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
}

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  video: VideoData;
  aspectRatio?: number;
}

// AlbumArtwork Component
export function AlbumArtwork({ video, aspectRatio = 3 / 4, className, ...props }: AlbumArtworkProps) {
  const isVideo = video.image.endsWith(".mp4");

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Link as={`/dashboard/p/${video.id}`} href={`/dashboard/p/${video.id}`}>
        <ContextMenu>
          <ContextMenuTrigger>
            <AspectRatio ratio={aspectRatio} className="overflow-hidden rounded-md">
              {isVideo ? (
                <video controls className="object-cover transition-all hover:scale-105" autoPlay muted loop>
                  <source src={video.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={video.image} alt={video.title} className="object-cover transition-all hover:scale-105" />
              )}
            </AspectRatio>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuItem>Add to Library</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Playlist
                </ContextMenuItem>
                <ContextMenuSeparator />
                {playlists.map((playlist) => (
                  <ContextMenuItem key={playlist}>
                    <ListMusic className="mr-2 h-4 w-4" /> {playlist}
                  </ContextMenuItem>
                ))}
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>Play Next</ContextMenuItem>
            <ContextMenuItem>Play Later</ContextMenuItem>
            <ContextMenuItem>Create Station</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Like</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Link>
    </div>
  );
}

const playlists = ["Recently Added", "Top Songs 2022", "Top Songs 2023"];
