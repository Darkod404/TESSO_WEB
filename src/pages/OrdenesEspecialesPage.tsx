import '../styles/ordenes-especiales.css'
import { useId, useState } from 'react'

const HERO_IMG =
  'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1400&q=80'

const CASES = [
  {
    title: 'Tech Summit 2024',
    body: '500 unidades de Performance Tech para staff y speakers.',
    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Boutique Agency',
    body: 'Producción de edición limitada Heavyweight Luxe para merch premium.',
    img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Creative Collective',
    body: 'Dotación personalizada con enfoque en sostenibilidad y durabilidad.',
    img: 'https://images.unsplash.com/photo-1523475472560-d2df999ecf52?auto=format&fit=crop&w=900&q=80',
  },
] as const

const SHIRT_TYPES = [
  'Essential Cotton Tee',
  'Heavyweight Luxe',
  'Performance Tech',
  'Oversized Boxy',
] as const

function CheckIcon() {
  return (
    <span className="oe-feature__icon" aria-hidden="true">
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
        <path d="M1 5.2 4.2 8.4 11 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function OrdenesEspecialesPage() {
  const formId = useId()
  const fileId = `${formId}-file`
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <>
      <section className="oe-hero" aria-labelledby="oe-hero-title">
        <div className="container">
          <div className="oe-hero__card">
            <div className="oe-hero__grid">
              <div className="oe-hero__copy">
                <p className="oe-hero__kicker">Soluciones corporativas</p>
                <h1 id="oe-hero-title">Producción personalizada para equipos y marcas</h1>
                <p>
                  Creamos camisetas para eventos, empresas, emprendimientos y producciones por volumen
                  con la calidad técnica que define a T3SO.
                </p>
                <div className="oe-features">
                  <div className="oe-feature">
                    <CheckIcon />
                    <span>Telas premium</span>
                  </div>
                  <div className="oe-feature">
                    <CheckIcon />
                    <span>Mínimos flexibles</span>
                  </div>
                  <div className="oe-feature">
                    <CheckIcon />
                    <span>Envío global</span>
                  </div>
                  <div className="oe-feature">
                    <CheckIcon />
                    <span>Asesoría de diseño</span>
                  </div>
                </div>
              </div>
              <div className="oe-hero__visual">
                <img src={HERO_IMG} alt="Producción textil industrial" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="oe-quote" aria-labelledby="oe-quote-title">
        <div className="container oe-quote__grid">
          <div className="oe-quote__intro">
            <h2 id="oe-quote-title">Solicita una cotización</h2>
            <p>
              Nuestro equipo de producción se pondrá en contacto contigo en menos de 24 horas hábiles
              para dar vida a tu proyecto.
            </p>
            <div className="oe-process">
              <h3>Proceso T3SO</h3>
              <ol>
                <li>
                  <span className="oe-process__num">01</span>
                  <span>Recepción de diseño y requisitos técnicos.</span>
                </li>
                <li>
                  <span className="oe-process__num">02</span>
                  <span>Muestra digital y cotización formal.</span>
                </li>
                <li>
                  <span className="oe-process__num">03</span>
                  <span>Producción artesanal de alta precisión.</span>
                </li>
              </ol>
            </div>
          </div>

          <form
            className="oe-form"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <div className="oe-form__row">
              <div className="oe-field">
                <label htmlFor={`${formId}-name`}>Nombre/apellidos</label>
                <input id={`${formId}-name`} name="name" type="text" autoComplete="name" placeholder="Tu nombre completo" />
              </div>
              <div className="oe-field">
                <label htmlFor={`${formId}-phone`}>Teléfono</label>
                <input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" placeholder="Tu número de contacto" />
              </div>
              <div className="oe-field">
                <label htmlFor={`${formId}-email`}>Email</label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div className="oe-field">
                <label htmlFor={`${formId}-qty`}>Cantidad</label>
                <input id={`${formId}-qty`} name="quantity" type="text" inputMode="numeric" placeholder="Mínimo 12 unidades" />
              </div>
              <div className="oe-field oe-field--full">
                <label htmlFor={`${formId}-shirt`}>Tipo de camiseta</label>
                <select id={`${formId}-shirt`} name="shirtType" defaultValue={SHIRT_TYPES[0]}>
                  {SHIRT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="oe-field oe-field--full oe-upload">
              <span className="oe-upload__label">Subir diseño (opcional)</span>
              <label className="oe-drop" htmlFor={fileId}>
                <input
                  id={fileId}
                  type="file"
                  className="sr-only"
                  accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
                  aria-label="Archivo de diseño"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    setFileName(f ? f.name : null)
                  }}
                />
                <div className="oe-drop__inner">
                  <div className="oe-drop__icon" aria-hidden="true">
                    <svg width="36" height="28" viewBox="0 0 24 20" fill="none">
                      <path
                        d="M8 17 12 13l4 4M12 13V3M4 15H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="oe-drop__title">
                    {fileName ? fileName : 'Carga un archivo o arrastra y suelta'}
                  </p>
                  <p className="oe-drop__hint">PNG, JPG, PDF hasta 10MB</p>
                </div>
              </label>
            </div>

            <div className="oe-field oe-field--full">
              <label htmlFor={`${formId}-msg`}>Mensaje</label>
              <textarea
                id={`${formId}-msg`}
                name="message"
                rows={4}
                placeholder="Cuéntanos más sobre tu proyecto o especificaciones especiales"
              />
            </div>

            <div className="oe-form__actions">
              <button type="submit" className="btn btn-primary oe-form__submit">
                Solicitar cotización <span aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="oe-cases" aria-labelledby="oe-cases-title">
        <div className="container">
          <h2 id="oe-cases-title">Casos de éxito</h2>
          <div className="oe-cases__grid">
            {CASES.map((c) => (
              <article key={c.title} className="oe-case">
                <div className="oe-case__media">
                  <img src={c.img} alt="" loading="lazy" decoding="async" />
                </div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
