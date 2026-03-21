import Navbar from '../../components/Navbar/Navbar'
import TelegramHero from '../../components/TelegramHero/TelegramHero'
import Features from '../../components/Features/Features'
import TryNow from '../../components/TryNow/TryNow'
import './Home.scss'
import Footer from '../../components/Footer/Footer'
import Faq from '../../components/Faq/Faq'
import LeadCapture from '../../components/LeadCapture/LeadCapture'
import Tariffs from '../../components/Tariffs/Tariffs'
import CompanyMarquee from '../../components/CompanyMarquee/CompanyMarquee'

export default function Home() {
  return (
    <main className="home">
      <Navbar />
      <TelegramHero />
      <Features />
      <TryNow />
      <CompanyMarquee />
      <Tariffs />
      <LeadCapture />
      <Faq />
      <Footer />
    </main>
  )
}
