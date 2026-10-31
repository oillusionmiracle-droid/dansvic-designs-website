import Image from "next/image";
export function Logo({className="h-10 w-auto"}:{className?:string}){return <Image src="/dansvic-logo.png" alt="Dansvic Designs — make it a reality" width={600} height={104} className={className+" shrink-0 dark:invert"} />}
