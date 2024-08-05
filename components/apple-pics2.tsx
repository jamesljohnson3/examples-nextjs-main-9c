import { getHome, getImages, getPornhubVideos } from "@/actions/home";
import type { XVideosResponse, YouPornResponse, PornhubVideo, PornhubResponse, VideoData } from "@/actions/home";
import * as React from "react";
import { ListMusic, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "../components/ui/context-menu";
import { Separator } from "../components/ui/separator";
import Link from "next/link";
import { HomeSection, ImageSection, PornhubSection } from "./sections";

export const revalidate = 3600;

const HomeData = React.lazy(() => getHome().then(data => ({ default: () => <HomeSection data={data} />})));
const ImageData = React.lazy(() => getImages().then(data => ({ default: () => <ImageSection data={data} />})));
const PornhubData = React.lazy(() => getPornhubVideos().then(data => ({ default: () => <PornhubSection data={data} />})));

async function MadeForYou() {
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
                <div className="flex space-x-4 pb-4 min-w-[150px]">
                  <React.Suspense fallback={<div>Loading Made For You Videos...</div>}>
                    <HomeData />
                  </React.Suspense>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Image Gallery Scroll Area */}
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight">Image Gallery</h2>
              <div style={{ overflowX: 'auto', maxWidth: '720px' }}>
                <div className="flex space-x-4 pb-4 min-w-[150px]">
                  <React.Suspense fallback={<div>Loading Image Gallery...</div>}>
                    <ImageData />
                  </React.Suspense>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Pornhub Videos Scroll Area */}
            <div className="relative">
              <h2 className="text-2xl font-semibold tracking-tight">Pornhub Videos</h2>
              <div style={{ overflowX: 'auto', maxWidth: '720px' }}>
                <div className="flex space-x-4 pb-4 min-w-[150px]">
                  <React.Suspense fallback={<div>Loading Pornhub Videos...</div>}>
                    <PornhubData />
                  </React.Suspense>
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


