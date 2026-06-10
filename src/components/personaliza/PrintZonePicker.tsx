import { useState } from 'react'
import { NORMALIZED_ZONES, type PrintZoneId } from './printZones'

type PrintZonePickerProps = {
  activeZone: PrintZoneId
  zonesWithDesign: Set<PrintZoneId>
  onSelect: (zoneId: PrintZoneId) => void
}

export function PrintZonePicker({ activeZone, zonesWithDesign, onSelect }: PrintZonePickerProps) {
  const [open, setOpen] = useState(false)
  const activeName = NORMALIZED_ZONES.find((z) => z.id === activeZone)?.name ?? 'Selecciona una zona'

  function handleSelect(zoneId: PrintZoneId) {
    onSelect(zoneId)
    setOpen(false)
  }

  return (
    <div className="pz-zones">
      <p className="pz-sub">Ubicación de impresión</p>
      <div
        className={`pz-zones__menu${open ? ' is-open' : ''}`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          type="button"
          className="pz-zones__trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="pz-zones__trigger-label">{activeName}</span>
          <span className="pz-zones__trigger-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        <div className="pz-zones__panel" role="listbox">
          <div className="pz-zones__grid">
            {NORMALIZED_ZONES.map((zone) => {
              const isActive = activeZone === zone.id
              const hasDesign = zonesWithDesign.has(zone.id)
              return (
                <button
                  key={zone.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`pz-zone${isActive ? ' is-active' : ''}${hasDesign ? ' has-design' : ''}`}
                  onClick={() => handleSelect(zone.id)}
                >
                  <span className="pz-zone__name">{zone.name}</span>
                  <span className="pz-zone__hint">{zone.hint}</span>
                  {hasDesign && (
                    <span className="pz-zone__dot" aria-label="Con diseño">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
