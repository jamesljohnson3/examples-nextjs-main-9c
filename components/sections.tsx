
"use client"
import  React, { useEffect, useState } from "react";
import type { XVideosResponse, YouPornResponse, PornhubVideo, PornhubResponse, VideoData } from "@/actions/home";
import { ListMusic, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "../components/ui/context-menu";
import { Separator } from "../components/ui/separator";
import Link from "next/link";

export function HomeSection({ fetchXVideosData }: { fetchXVideosData: () => Promise<XVideosResponse | null> }) {
  const [data, setData] = useState<XVideosResponse | null>(null);

  // Fetch from localStorage or API
  useEffect(() => {
    const localData = localStorage.getItem("xvideosData");
    if (localData) {
      setData(JSON.parse(localData));
    } else {
      fetchXVideosData().then((response) => {
        if (response) {
          localStorage.setItem("xvideosData", JSON.stringify(response));
          setData(response);
        }
      });
    }
  }, [fetchXVideosData]);

  if (!data) return <p>No data available</p>;
  const madeForYouVideo: VideoData = data.data;

  return <AlbumArtwork video={madeForYouVideo} className="w-[150px]" aspectRatio={1 / 1} />;
}

export function ImageSection({ fetchYouPornData }: { fetchYouPornData: () => Promise<YouPornResponse | null> }) {
  const [data, setData] = useState<YouPornResponse | null>(null);

  // Fetch from localStorage or API
  useEffect(() => {
    const localData = localStorage.getItem("youpornData");
    if (localData) {
      setData(JSON.parse(localData));
    } else {
      fetchYouPornData().then((response) => {
        if (response) {
          localStorage.setItem("youpornData", JSON.stringify(response));
          setData(response);
        }
      });
    }
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

export function PornhubSection({ fetchPornhubData }: { fetchPornhubData: () => Promise<PornhubResponse | null> }) {
  const [data, setData] = useState<PornhubResponse | null>(null);

  // Fetch from localStorage or API
  useEffect(() => {
    const localData = localStorage.getItem("pornhubData");
    if (localData) {
      setData(JSON.parse(localData));
    } else {
      fetchPornhubData().then((response) => {
        if (response) {
          localStorage.setItem("pornhubData", JSON.stringify(response));
          setData(response);
        }
      });
    }
  }, [fetchPornhubData]);

  if (!data) return <p>No data available</p>;

  const pornhubVideos: PornhubVideo[] = data.data;
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
                <p className="text-xs text-slate-500 hidden dark:text-slate-400">{video.duration} - {video.views}</p>
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

function AlbumArtwork({ video, aspectRatio = 3 / 4, className, ...props }: AlbumArtworkProps) {
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
