
export const dynamic = 'force-dynamic'; // defaults to auto

// Your hardcoded data
const TEMPLATES = 
 
  [{"id":7,"logoImage":"https://unlimitednow.live/assets/images/favicon.png","title":"Getting Started","details":"Create Unlimited Now","coverImage":"https://unlimitednow.live/assets/images/red-and-black-friday-fashion-business-social-feed-ad-743x743.png","link":"https://www.unlimitpotential.com/guide"},{"id":3,"logoImage":"https://unlimitednow.live/assets/images/favicon.png","title":"GMP Web App","details":"Preview","coverImage":"https://ipfs.io/ipfs/bafybeid4cdgvqdcmdibn7ytxfdus44rhjcji2rqbdnrrngqk3abxf56hby/GMPwebsite001.png","link":"https://gmp.unlimitednow.site/"},{"id":4,"logoImage":"https://unlimitednow.live/assets/images/favicon.png","title":"GMP Images","details":"Preview","coverImage":"https://ipfs.io/ipfs/bafybeid4cdgvqdcmdibn7ytxfdus44rhjcji2rqbdnrrngqk3abxf56hby/GMPwebsite003.png","link":"https://ipfs.io/ipfs/bafybeid4cdgvqdcmdibn7ytxfdus44rhjcji2rqbdnrrngqk3abxf56hby"},{"id":5,"logoImage":"https://unlimitednow.live/assets/images/favicon.png","title":"DVA Benefit Concert Raw Footage","details":"Preview","coverImage":"https://ipfs.io/ipfs/bafybeiehc2vhtudvs5pjixrzst7xtrzxsqvhypjkioq6zwjkw2w3ed6npq","link":"https://ipfs.io/ipfs/bafybeibfuff6meakcwlczfwy53fbqvd4gjenwdpk2rvclyvnmmcfxwomrm"},{"id":6,"logoImage":"https://unlimitednow.live/assets/images/favicon.png","title":"GMP Web Kit","details":"Preview","coverImage":"https://ipfs.io/ipfs/bafybeid4cdgvqdcmdibn7ytxfdus44rhjcji2rqbdnrrngqk3abxf56hby/GMPwebsite001.png","link":"https://ipfs.io/ipfs/bafybeifi2ydj2nrjv7md2vaxaoj4bon5ygwpk7nmprzp5adaantiwwgize"}]
;

export async function GET(request: Request) {
  // Returning the hardcoded data as JSON response
  return new Response(JSON.stringify(TEMPLATES), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
