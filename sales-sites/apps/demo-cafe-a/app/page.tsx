import { SalesSite } from "@sales-sites/ui";
import { getSite } from "../lib/site";

export default function Home() {
  return <SalesSite site={getSite()} />;
}
