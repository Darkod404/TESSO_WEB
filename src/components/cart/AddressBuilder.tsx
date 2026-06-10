import { useEffect, useMemo, useState } from 'react'

/** Tipos de vía principal según la nomenclatura urbana colombiana. */
export const VIA_TYPES = [
  'Calle',
  'Carrera',
  'Avenida',
  'Avenida Calle',
  'Avenida Carrera',
  'Diagonal',
  'Transversal',
  'Circular',
  'Circunvalar',
  'Autopista',
  'Vía',
] as const

const LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const

export type AddressParts = {
  via: string
  viaNum: string
  viaLetter: string
  bis: string
  bisLetter: string
  cardinal: string
  plateNum: string
  plateLetter: string
  plateDistance: string
}

const EMPTY: AddressParts = {
  via: 'Calle',
  viaNum: '',
  viaLetter: '',
  bis: '',
  bisLetter: '',
  cardinal: '',
  plateNum: '',
  plateLetter: '',
  plateDistance: '',
}

/** Arma la dirección en formato estándar: "Calle 35A bis #1B-39 Sur". */
export function buildAddress(p: AddressParts): string {
  if (!p.via || !p.viaNum) return ''
  const viaPart = `${p.via} ${p.viaNum}${p.viaLetter}${p.bis === 'bis' ? ' bis' : ''}`
  const hasPlate = p.plateNum && p.plateDistance
  if (!hasPlate) return p.cardinal ? `${viaPart} ${p.cardinal}` : viaPart
  const plate = `#${p.plateNum}${p.plateLetter}-${p.plateDistance}`
  return `${viaPart} ${plate}${p.cardinal ? ` ${p.cardinal}` : ''}`
}

type AddressBuilderProps = {
  onChange: (address: string) => void
}

export function AddressBuilder({ onChange }: AddressBuilderProps) {
  const [parts, setParts] = useState<AddressParts>(EMPTY)
  const address = useMemo(() => buildAddress(parts), [parts])

  useEffect(() => {
    onChange(address)
  }, [address, onChange])

  function set<K extends keyof AddressParts>(key: K, value: AddressParts[K]) {
    setParts((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="addr-builder">
      <div className="addr-builder__grid">
        <label className="cart-field addr-builder__via">
          <span className="cart-field__label">Vía principal</span>
          <select
            className="cart-field__control"
            value={parts.via}
            onChange={(e) => set('via', e.target.value)}
          >
            {VIA_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">N.°</span>
          <input
            className="cart-field__control"
            type="text"
            inputMode="numeric"
            placeholder="35"
            value={parts.viaNum}
            onChange={(e) => set('viaNum', e.target.value.replace(/[^0-9]/g, ''))}
          />
        </label>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Letra</span>
          <select
            className="cart-field__control"
            value={parts.viaLetter}
            onChange={(e) => set('viaLetter', e.target.value)}
          >
            {LETTERS.map((l) => (
              <option key={l || 'none'} value={l}>
                {l || '—'}
              </option>
            ))}
          </select>
        </label>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Bis</span>
          <select
            className="cart-field__control"
            value={parts.bis}
            onChange={(e) => set('bis', e.target.value)}
          >
            <option value="">No</option>
            <option value="bis">Bis</option>
          </select>
        </label>

        <span className="addr-builder__hash" aria-hidden="true">
          #
        </span>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Placa</span>
          <input
            className="cart-field__control"
            type="text"
            inputMode="numeric"
            placeholder="1"
            value={parts.plateNum}
            onChange={(e) => set('plateNum', e.target.value.replace(/[^0-9]/g, ''))}
          />
        </label>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Letra</span>
          <select
            className="cart-field__control"
            value={parts.plateLetter}
            onChange={(e) => set('plateLetter', e.target.value)}
          >
            {LETTERS.map((l) => (
              <option key={l || 'none'} value={l}>
                {l || '—'}
              </option>
            ))}
          </select>
        </label>

        <span className="addr-builder__dash" aria-hidden="true">
          –
        </span>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Número</span>
          <input
            className="cart-field__control"
            type="text"
            inputMode="numeric"
            placeholder="39"
            value={parts.plateDistance}
            onChange={(e) => set('plateDistance', e.target.value.replace(/[^0-9]/g, ''))}
          />
        </label>

        <label className="cart-field addr-builder__sm">
          <span className="cart-field__label">Sector</span>
          <select
            className="cart-field__control"
            value={parts.cardinal}
            onChange={(e) => set('cardinal', e.target.value)}
          >
            <option value="">—</option>
            <option value="Sur">Sur</option>
            <option value="Norte">Norte</option>
            <option value="Este">Este</option>
            <option value="Oeste">Oeste</option>
          </select>
        </label>
      </div>

      <p className="addr-builder__preview">
        {address ? (
          <>
            <span className="addr-builder__preview-label">Dirección:</span> {address}
          </>
        ) : (
          <span className="addr-builder__preview-muted">
            Completa la vía y el número para armar tu dirección.
          </span>
        )}
      </p>
    </div>
  )
}
