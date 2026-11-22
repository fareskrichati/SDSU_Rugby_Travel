import {mapLinks} from '../lib/matches';
export default function MapLinks({address}:{address:string}){if(!address.trim())return null;const links=mapLinks(address);return <div className="map-links"><a href={links.google} target="_blank" rel="noopener noreferrer">Google Maps</a><a href={links.apple} target="_blank" rel="noopener noreferrer">Apple Maps</a></div>}
