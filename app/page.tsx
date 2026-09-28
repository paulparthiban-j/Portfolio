import { getPortfolioData } from "@/lib/portfolio";
import { HomePage } from "@/components/home/HomePage";

// Serve a cached, pre-rendered page and refresh it in the background at most
// once a minute, so edits to data/portfolio.json still show up.
export const revalidate = 60;

export default async function Home() {
  const content = await getPortfolioData();
  return <HomePage content={content} />;
}
