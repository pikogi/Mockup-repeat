import ShowcaseView from '@/components/showcase/ShowcaseView'
import { BURGER_BRAND, BURGER_SHOWCASE } from '@/constants/burgerShowcase'

export default function PublicShowcaseBurger() {
  return <ShowcaseView brand={BURGER_BRAND} showcase={BURGER_SHOWCASE} />
}
