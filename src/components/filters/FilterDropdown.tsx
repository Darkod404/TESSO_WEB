import { useEffect, useId, useRef, useState } from 'react'
import './FilterDropdown.css'

type Props<T extends string> = {
  label: string
  options: readonly T[]
  selected: ReadonlySet<T>
  onToggle: (value: T) => void
  onClear?: () => void
  align?: 'left' | 'right'
  variant?: 'default' | 'compact'
}

function IconChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12l5 5 9-11"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FilterDropdown<T extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
  align = 'left',
  variant = 'default',
}: Props<T>) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()
  const count = selected.size

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`filter-dd${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`filter-dd__trigger${count > 0 ? ' has-selection' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="filter-dd__label">{label}</span>
        {count > 0 ? (
          <span className="filter-dd__count" aria-label={`${count} seleccionados`}>
            {count}
          </span>
        ) : null}
        <span className="filter-dd__chevron" aria-hidden="true">
          <IconChevron />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className={`filter-dd__panel filter-dd__panel--${align}${
            variant === 'compact' ? ' filter-dd__panel--compact' : ''
          }`}
          role="dialog"
          aria-label={`Filtrar por ${label}`}
        >
          <ul className="filter-dd__list" role="listbox" aria-multiselectable="true">
            {options.map((opt) => {
              const active = selected.has(opt)
              return (
                <li key={opt}>
                  <label
                    className={`filter-dd__option${active ? ' is-active' : ''}`}
                    role="option"
                    aria-selected={active}
                  >
                    <input
                      type="checkbox"
                      className="filter-dd__input"
                      checked={active}
                      onChange={() => onToggle(opt)}
                    />
                    <span className="filter-dd__box" aria-hidden="true">
                      {active ? <IconCheck /> : null}
                    </span>
                    <span className="filter-dd__text">{opt}</span>
                  </label>
                </li>
              )
            })}
          </ul>
          {count > 0 && onClear ? (
            <div className="filter-dd__footer">
              <button type="button" className="filter-dd__clear" onClick={onClear}>
                Limpiar
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
