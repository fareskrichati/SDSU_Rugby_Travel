import './globals.css';
export const viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata={title:'SDSU Rugby | Travel Hub',description:'The team home for travel packets, annual schedules, and the rugby roster.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
