import { useMemo, useState } from 'react'
import './Tariffs.scss'

const plans = [
  {
    title: 'Старт',
    metaMain: '50 диалогов',
    metaSub: '1 аккаунт',
    price: '10 000 ₽/мес',
    features: ['Мгновенные ответы 24/7', 'Интеграция с Циан и Авито', 'Обслуживание и тех. поддержка'],
  },
  {
    title: 'Оптима',
    metaMain: '150 диалогов',
    metaSub: '3 аккаунта',
    price: '20 000 ₽/мес',
    features: ['Мгновенные ответы 24/7', 'Интеграция с Циан и Авито', 'Обслуживание и тех. поддержка'],
  },
  {
    title: 'Ультра',
    metaMain: '300 диалогов',
    metaSub: '5 аккаунтов',
    price: '30 000 ₽/мес',
    features: ['Мгновенные ответы 24/7', 'Интеграция с Циан и Авито', 'Обслуживание и тех. поддержка'],
  },
]

const parsePercent = (value) => {
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[^\d.,]/g, '').replace(/,/g, '.')
  if (!cleaned) return 0
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

const parseIntLike = (value) => {
  if (typeof value !== 'string') return 0
  const cleaned = value.replace(/[^\d]/g, '')
  if (!cleaned) return 0
  const parsed = Number(cleaned)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatNumber = (value) => {
  const safe = Number.isFinite(value) ? Math.round(value) : 0
  return safe.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formatPercent = (value) => {
  const safe = Number.isFinite(value) ? value : 0
  const fixed = safe.toFixed(1).replace(/\.0$/, '')
  return `+${fixed}%`
}

export default function Tariffs() {
  const defaultConv = '5%'
  const defaultDeal = '100.000'
  const defaultLeads = '150'

  const [conv, setConv] = useState('')
  const [deal, setDeal] = useState('')
  const [leads, setLeads] = useState('')

  const results = useMemo(() => {
    const convValue = parsePercent(conv.trim() ? conv : defaultConv)
    const dealValue = parseIntLike(deal.trim() ? deal : defaultDeal)
    const leadsValue = parseIntLike(leads.trim() ? leads : defaultLeads)

    const aiConv = convValue * 0.3
    const extraDeals = Math.round(leadsValue * (aiConv / 100))
    const revenue = extraDeals * dealValue
    const hours = Math.floor(leadsValue * 0.33)

    return [
      { label: 'Конверсия с ИИ:', value: formatPercent(aiConv) },
      { label: 'Доп. закрытых сделок:', value: `${extraDeals}` },
      { label: 'Доп. выручка', value: `+${formatNumber(revenue)} ₽/мес` },
      { label: 'Экономия времени:', value: `${hours} часов/мес` },
    ]
  }, [conv, deal, leads])

  return (
    <section className="tariffs" id="tariffs">
      <div className="tariffs__inner">
        <header className="tariffs__header">
          <h2 className="tariffs__title">
            Рассчитайте <span>прибыль</span> и
            <br />
            выберете тариф
          </h2>
          <p className="tariffs__subtitle">
            ИИ-риелтор окупается уже с <strong>первой сделки</strong>!
          </p>
        </header>

        <div className="tariffs__calculator">
          <div className="tariffs__fields">
            <div className="tariffs__field">
              <label className="tariffs__label" htmlFor="conversion">
                Текущая конверсия в % (без ИИ)
              </label>
              <input
                className="tariffs__input"
                id="conversion"
                name="conversion"
                type="text"
                value={conv}
                onChange={(event) => setConv(event.target.value)}
                placeholder={defaultConv}
              />
            </div>

            <div className="tariffs__field">
              <label className="tariffs__label" htmlFor="avg-deal">
                Средняя сделка (₽)
              </label>
              <input
                className="tariffs__input"
                id="avg-deal"
                name="avg-deal"
                type="text"
                value={deal}
                onChange={(event) => setDeal(event.target.value)}
                placeholder={defaultDeal}
              />
            </div>

            <div className="tariffs__field">
              <label className="tariffs__label" htmlFor="leads">
                Количество заявок в месяц
              </label>
              <input
                className="tariffs__input"
                id="leads"
                name="leads"
                type="text"
                value={leads}
                onChange={(event) => setLeads(event.target.value)}
                placeholder={defaultLeads}
              />
            </div>
          </div>

          <div className="tariffs__result">
            <h3 className="tariffs__result-title">Ожидаемый результат</h3>
            <div className="tariffs__result-list">
              {results.map((item) => (
                <div className="tariffs__result-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <a className="tariffs__result-button" href="https://t.me/swift_manager">
              <span className="tariffs__result-icon" aria-hidden="true">
<svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.499172 7.2935C0.542806 7.2713 0.586459 7.25021 0.629001 7.23023C1.36858 6.88169 2.11798 6.55536 2.86629 6.22902C2.90665 6.22902 2.97427 6.18129 3.01245 6.16575C3.07026 6.14022 3.12808 6.1158 3.1859 6.09027C3.29716 6.04143 3.40843 5.9937 3.5186 5.94486C3.74113 5.84829 3.96256 5.75171 4.18509 5.65514L5.51698 5.07462C6.40492 4.68834 7.29396 4.30095 8.1819 3.91467C9.06983 3.52839 9.95885 3.141 10.8468 2.75472C11.7347 2.36844 12.6237 1.98106 13.5117 1.59478C14.3996 1.2085 15.2886 0.821113 16.1766 0.434834C16.374 0.348254 16.5878 0.219492 16.7994 0.181752C16.9772 0.149562 17.1507 0.0874049 17.3296 0.052995C17.6688 -0.0124948 18.043 -0.0391323 18.368 0.104057C18.4804 0.154007 18.584 0.223936 18.6702 0.311626C19.0825 0.726765 19.0247 1.4083 18.9375 1.99216C18.3299 6.0614 17.7223 10.1318 17.1136 14.201C17.0307 14.7593 16.9172 15.3721 16.4842 15.725C16.1177 16.0236 15.5962 16.0569 15.1435 15.9304C14.6909 15.8027 14.2916 15.5352 13.9 15.2722C12.2758 14.1777 10.6504 13.0832 9.0262 11.9888C8.64005 11.729 8.21026 11.3894 8.21463 10.9176C8.21681 10.6335 8.38369 10.3804 8.55386 10.1551C9.96539 8.2814 12.002 6.9938 13.5171 5.20671C13.7309 4.95474 13.8989 4.49964 13.6055 4.35423C13.431 4.26765 13.2302 4.38531 13.071 4.49742C11.0682 5.91266 9.06656 7.32902 7.0638 8.74427C6.41039 9.20603 5.72535 9.68111 4.93777 9.79433C4.2331 9.89645 3.52406 9.69664 2.8423 9.4924C2.2707 9.32146 1.70018 9.14608 1.13186 8.96516C0.829699 8.8697 0.51772 8.76647 0.284282 8.55002C0.050845 8.33357 -0.0833088 7.96949 0.0574081 7.68089C0.145765 7.49996 0.317029 7.38563 0.497015 7.29239L0.499172 7.2935Z" fill="#383838"/>
</svg>

              </span>
              Написать в Telegram
            </a>
          </div>
        </div>

        <div className="tariffs__plans">
          {plans.map((plan) => (
            <article className="tariff-card" key={plan.title}>

              <h3 className="tariff-card__title">{plan.title}</h3>

              <p className="tariff-card__meta">
                  <span className="tariff-card__meta-main">{plan.metaMain}</span> •{' '}
                  <span className="tariff-card__meta-sub">{plan.metaSub}</span>
              </p>
              <div className="tariff-card__price">{plan.price}</div>
              <ul className="tariff-card__list">
                {plan.features.map((feature) => (
                  <li className="tariff-card__item" key={feature}>
                    <span className="tariff-card__check" aria-hidden="true">
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_78_347)">
<path d="M14.6667 7.38674V8.00007C14.6658 9.43769 14.2003 10.8365 13.3396 11.988C12.4788 13.1394 11.2689 13.9817 9.89023 14.3893C8.51162 14.797 7.03817 14.748 5.68964 14.2498C4.34112 13.7516 3.18976 12.8308 2.4073 11.6248C1.62484 10.4188 1.25319 8.99212 1.34778 7.55762C1.44237 6.12312 1.99813 4.75762 2.93218 3.66479C3.86623 2.57195 5.12852 1.81033 6.53079 1.4935C7.93306 1.17668 9.40017 1.32163 10.7133 1.90674M14.6667 2.66674L8 9.34007L6 7.34007" stroke="#0468FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_78_347">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
