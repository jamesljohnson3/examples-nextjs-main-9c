import { getHome, getImages, getPornhubVideos } from "@/actions/home";
import type { XVideosResponse, YouPornResponse, PornhubVideo, PornhubResponse, VideoData } from "@/actions/home";
import * as React from "react";
import { ListMusic, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "../components/ui/context-menu";
import { Separator } from "../components/ui/separator";
import Link from "next/link";

export const revalidate = 3600;

async function MadeForYou() {
  const homeData: XVideosResponse | null = await getHome();
  const imageData: YouPornResponse | null = await getImages();
  const pornhubData: PornhubResponse | null = await getPornhubVideos();

  if (!homeData || !imageData || !pornhubData) {
    return <p>No data available</p>;
  }

  const madeForYouVideo: VideoData = homeData.data;
  const imageItems: string[] = imageData.assets;
  const pornhubVideos: PornhubVideo[] = pornhubData.data;

  console.log('madeForYouVideos:', madeForYouVideo);
  console.log('imageItems:', imageItems);
  console.log('pornhubVideos:', pornhubVideos);

  return (
    <div className="flex min-h-full flex-col font-sans text-zinc-900 bg-zinc-50 dark:text-zinc-100 dark:bg-black">
      <div className="text-center">
        {/* Header or other content here */}
      </div>

      <section>
        <div className="max-w-screen-3xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
          <section className="rounded-md bg-white dark:bg-gray-950 shadow-lg p-4">
            <div className="mt-6 space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Made for You</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your personal playlists. Updated daily.</p>
            </div>
            <Separator className="my-4" />

            {/* Made For You Videos Scroll Area */}
            <div className="relative">
              <DemoIndicator className="top-32 right-auto left-16 z-30" />
              <div style={{ overflowX: 'auto', maxWidth: '720px' }}>
                <div className="flex space-x-4 pb-4">
                <AlbumArtwork video={madeForYouVideo} className="w-[150px]" aspectRatio={1 / 1} />

                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Image Gallery Scroll Area */}
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight">Image Gallery</h2>
              <div style={{ overflowX: 'auto', maxWidth: '720px' }}>
                <div className="flex space-x-4 pb-4">
                  {imageItems.map((image, index) => (
                    <div key={index} className="w-[150px]">
                      <img src={image} alt={`Image ${index}`} className="object-cover transition-all hover:scale-105" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Pornhub Videos Scroll Area */}
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight">Pornhub Videos</h2>
              <div style={{ overflowX: 'auto', maxWidth: '720px' }}>
                <div className="flex space-x-4 pb-4">
                  {pornhubVideos.map((video) => (
                    <div key={video.id} className="w-[150px]">
                      <Link href={video.link} passHref>
                        <a target="_blank">
                          <AspectRatio ratio={1 / 1} className="overflow-hidden rounded-md">
                            <img src={video.image} alt={video.title} className="object-cover w-36 transition-all hover:scale-105" />
                          </AspectRatio>
                          <div className="space-y-1 text-sm mt-2">
                            <h3 className="font-medium hidden leading-none">{video.title}</h3>
                            <p className="text-xs text-slate-500 hidden dark:text-slate-400">{video.duration} - {video.views}</p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="text-center mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
            Cta Banner
            {/* Additional content here */}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MadeForYou;

interface DemoIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function DemoIndicator({ className }: DemoIndicatorProps) {
  return (
    <span className={cn("absolute top-1 right-0 flex h-5 w-5 animate-bounce items-center justify-center", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500" />
    </span>
  );
}

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  video: VideoData;
  aspectRatio?: number;
}

function AlbumArtwork({ video, aspectRatio = 3 / 4, className, ...props }: AlbumArtworkProps) {
  const isVideo = video.image.endsWith('.mp4');

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
      <div className="space-y-1 text-sm">
        <h3 className="font-medium hidden leading-none">{video.title}</h3>
        <p className="text-xs hidden text-slate-500 dark:text-slate-400">{video.title}</p>
      </div>
    </div>
  );
}

const playlists = [
  "Recently Added",
  "Recently Played",
];
