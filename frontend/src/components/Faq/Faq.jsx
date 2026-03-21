import { useEffect, useState } from 'react'
import './Faq.scss'

const initialItems = [
  {
    id: 'time',
    question: 'Сколько времени занимает запуск магазина?',
    answer:
      'В среднем 2–5 дней под ключ. Если требуется дополнительная кастомизация, срок может быть немного длиннее.',
    open: true,
  },
  {
    id: 'no-code',
    question: 'Нужно ли программирование?',
    answer:
      'Нет, программирование не требуется. Вы управляете магазином через полноценную админ-панель, добавляете товары, акции и проверяете заказы.',
    open: false,
  },
  {
    id: 'payments',
    question: 'Как происходит оплата?',
    answer: 'Можно использовать ЮKassa или подключить любую другую кассу — выбор за вами.',
    open: false,
  },
  {
    id: 'delivery',
    question: 'Можно ли подключить доставку?',
    answer: 'Да, модули доставки подключаются отдельно и интегрируются с магазином под ваш процесс.',
    open: false,
  },
  {
    id: 'crm',
    question: 'Можно ли интегрировать остатки и CRM?',
    answer:
      'Да, остатки товаров можно синхронизировать с вашей CRM-системой, чтобы учёт был автоматическим.',
    open: false,
  },
  {
    id: 'custom',
    question: 'Можно ли кастомизировать дизайн?',
    answer:
      'Да, магазин полностью адаптируется под ваш бренд: цвета, логотип, структура каталога и сценарии продаж.',
    open: false,
  },
]

export default function Faq() {
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    const controller = new AbortController()
    const apiBase = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL || ''

    const endpoint = apiBase ? `${apiBase}/api/faq/` : '/api/faq/'
    fetch(endpoint, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          return
        }
        const mapped = data.map((item, index) => ({
          id: item.id ?? `${index}`,
          question: item.question,
          answer: item.answer,
          open: index === 0,
        }))
        setItems(mapped)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          // keep fallback content
        }
      })

    return () => controller.abort()
  }, [])

  const handleToggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, open: !item.open } : item)),
    )
  }

  return (
    <section className="faq" id="faq">
      <div className="faq__inner">
        <h2 className="faq__title">Частые вопросы</h2>

        <div className="faq__list">
          {items.map((item) => (
            <article
              className={`faq__item ${item.open ? 'is-open' : ''}`}
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleToggle(item.id)
                }
              }}
              aria-expanded={item.open}
              aria-controls={`faq-answer-${item.id}`}
            >
              <div className="faq__question">
                <h3>{item.question}</h3>
                <svg
                  className="faq__chevron"
                  width="27"
                  height="15"
                  viewBox="0 0 27 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
<path d="M1.5 1.5L13.5 13.5L25.5 1.5" stroke="#0468FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

              </div>
              <p className="faq__answer" id={`faq-answer-${item.id}`}>
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
