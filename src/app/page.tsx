import { Hero } from "@/components/sections/hero";
import { Approach } from "@/components/sections/approach";
import { Services } from "@/components/sections/services";
import { Team } from "@/components/sections/team";
import { Faq } from "@/components/sections/faq";
import { Contacts } from "@/components/sections/contacts";

export default function Home() {
  return <main id="main" tabIndex={-1}><div id="top" /><Hero /><Approach /><Services /><Team /><Faq /><Contacts /></main>;
}
