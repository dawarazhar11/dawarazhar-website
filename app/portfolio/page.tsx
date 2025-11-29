import { getAllProjects, getPortfolioCategories } from "@/lib/portfolio"
import { PortfolioContent } from "@/components/portfolio/portfolio-content"

export default function PortfolioPage() {
  const projects = getAllProjects()
  const categories = getPortfolioCategories()

  return <PortfolioContent projects={projects} categories={categories} />
}
