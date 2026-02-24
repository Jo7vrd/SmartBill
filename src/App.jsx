import { useState } from 'react'

// ─── Helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

// Simulated AI-parsed items from a receipt photo
const DEMO_ITEMS = [
  { id: uid(), name: 'Nasi Goreng Spesial',  price: 35000 },
  { id: uid(), name: 'Mie Ayam Bakso',       price: 28000 },
  { id: uid(), name: 'Es Teh Manis',         price: 8000  },
  { id: uid(), name: 'Jus Alpukat',          price: 18000 },
  { id: uid(), name: 'Ayam Bakar Madu',      price: 45000 },
]

// ─── Step indicators ─────────────────────────────────────────────────────────
const STEPS = ['Upload Struk', 'Tambah Orang', 'Bagi Item', 'Ringkasan']

function Stepper({ current }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : ''
        return (
          <div key={i} className="step" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div className={`step-circle ${state}`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`step-label ${state}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1 – Upload Receipt ──────────────────────────────────────────────────
function UploadStep({ items, setItems, onNext }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [parsed, setParsed] = useState(false)

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setParsed(false)
    // Simulate AI parsing
    setParsing(true)
    setTimeout(() => {
      setItems(DEMO_ITEMS.map(it => ({ ...it, id: uid() })))
      setParsing(false)
      setParsed(true)
    }, 2000)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const addItem = () =>
    setItems(prev => [...prev, { id: uid(), name: '', price: 0 }])

  const removeItem = (id) =>
    setItems(prev => prev.filter(it => it.id !== id))

  const updateItem = (id, field, val) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: field === 'price' ? Number(val) : val } : it))

  const subtotal = items.reduce((s, it) => s + (it.price || 0), 0)
  const canProceed = items.length > 0 && items.every(it => it.name.trim() !== '' && it.price > 0)

  return (
    <>
      <div className="card">
        <div className="card-title">📸 Upload Struk</div>
        <div className="card-sub">Foto struk kamu dan AI akan membaca item-itemnya otomatis</div>

        {!file ? (
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
            <span className="upload-icon">🧾</span>
            <h3>Drag &amp; drop foto struk</h3>
            <p>atau klik untuk memilih file · JPG, PNG, HEIC</p>
          </div>
        ) : (
          <div className="receipt-preview">
            <img src={preview} alt="Receipt preview" />
            <div className="info">
              <h4>{file.name}</h4>
              <p>{(file.size / 1024).toFixed(1)} KB</p>
              {parsing && <p style={{ color: 'var(--primary)', marginTop: 8 }}>🤖 AI sedang membaca struk…</p>}
              {parsed  && <p style={{ color: 'var(--primary)', marginTop: 8 }}>✅ {items.length} item berhasil dibaca!</p>}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { setFile(null); setPreview(null); setParsed(false); setItems([]); }}>
              Ganti
            </button>
          </div>
        )}

        {parsing && (
          <div className="parsing-loader">
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Menganalisis struk dengan AI…</p>
          </div>
        )}
      </div>

      {!parsing && (
        <div className="card">
          <div className="card-title">🛒 Daftar Item</div>
          <div className="card-sub">Edit atau tambah item dari struk kamu</div>

          {items.length === 0 && !file && (
            <div className="empty">Upload struk atau tambah item secara manual</div>
          )}

          <div className="items-list">
            {items.map(it => (
              <div key={it.id} className="item-row">
                <input
                  placeholder="Nama item"
                  value={it.name}
                  onChange={e => updateItem(it.id, 'name', e.target.value)}
                />
                <input
                  className="price-input"
                  type="number"
                  min="0"
                  placeholder="Harga"
                  value={it.price || ''}
                  onChange={e => updateItem(it.id, 'price', e.target.value)}
                />
                <button className="del-btn" onClick={() => removeItem(it.id)} title="Hapus item">✕</button>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <p style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-muted)', marginTop: 12 }}>
              Subtotal: <strong style={{ color: 'var(--primary-dark)' }}>{fmt(subtotal)}</strong>
            </p>
          )}

          <div className="divider" />
          <button className="btn btn-outline btn-sm" onClick={addItem}>+ Tambah Item</button>
        </div>
      )}

      <div className="nav-actions">
        <span />
        <button className="btn btn-primary" disabled={!canProceed} onClick={onNext}>
          Lanjut →
        </button>
      </div>
    </>
  )
}

// ─── Step 2 – People Manager ──────────────────────────────────────────────────
function PeopleStep({ people, setPeople, onBack, onNext }) {
  const [name, setName] = useState('')

  const addPerson = () => {
    const n = name.trim()
    if (!n) return
    if (people.some(p => p.name.toLowerCase() === n.toLowerCase())) return
    setPeople(prev => [...prev, { id: uid(), name: n }])
    setName('')
  }

  const removePerson = (id) => setPeople(prev => prev.filter(p => p.id !== id))

  const handleKey = (e) => { if (e.key === 'Enter') addPerson() }

  return (
    <>
      <div className="card">
        <div className="card-title">👥 Siapa Saja yang Ikut?</div>
        <div className="card-sub">Tambahkan nama orang yang ikut makan</div>

        <div className="people-chips">
          {people.map(p => (
            <div key={p.id} className="chip">
              {p.name}
              <button onClick={() => removePerson(p.id)} title="Hapus">✕</button>
            </div>
          ))}
          {people.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Belum ada orang ditambahkan</span>}
        </div>

        <div className="add-person-row">
          <input
            placeholder="Nama orang (tekan Enter)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            maxLength={40}
          />
          <button className="btn btn-primary btn-sm" onClick={addPerson} disabled={!name.trim()}>
            + Tambah
          </button>
        </div>
      </div>

      <div className="nav-actions">
        <button className="btn btn-outline" onClick={onBack}>← Kembali</button>
        <button className="btn btn-primary" disabled={people.length < 2} onClick={onNext}>
          Lanjut →
        </button>
      </div>
    </>
  )
}

// ─── Step 3 – Item Assignment ─────────────────────────────────────────────────
function AssignStep({ items, people, assignments, setAssignments, tax, setTax, service, setService, onBack, onNext }) {
  const toggle = (itemId, personId) => {
    setAssignments(prev => {
      const cur = prev[itemId] || []
      const next = cur.includes(personId) ? cur.filter(x => x !== personId) : [...cur, personId]
      return { ...prev, [itemId]: next }
    })
  }

  const selectAll = (itemId) => {
    setAssignments(prev => ({ ...prev, [itemId]: people.map(p => p.id) }))
  }

  const canProceed = items.every(it => (assignments[it.id] || []).length > 0)

  return (
    <>
      <div className="card">
        <div className="card-title">🍽️ Siapa Pesan Apa?</div>
        <div className="card-sub">Pilih siapa yang memesan setiap item (bisa lebih dari satu orang)</div>

        {!canProceed && (
          <div className="alert alert-warning">⚠️ Semua item harus di-assign ke minimal 1 orang</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(it => {
            const assigned = assignments[it.id] || []
            return (
              <div key={it.id} className="assign-card">
                <div className="assign-header">
                  <span className="item-name">{it.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                      style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => selectAll(it.id)}
                    >
                      Semua
                    </button>
                    <span className="item-price">{fmt(it.price)}</span>
                  </div>
                </div>
                <div className="assign-people">
                  {people.map(p => (
                    <button
                      key={p.id}
                      className={`assign-pill ${assigned.includes(p.id) ? 'selected' : ''}`}
                      onClick={() => toggle(it.id, p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-title">🧾 Pajak & Biaya Tambahan</div>
        <div className="card-sub">Masukkan pajak dan service charge (dibagi rata ke semua orang)</div>

        <div className="extra-row">
          <label>Pajak (PPN, %)</label>
          <input type="number" min="0" max="100" step="0.1" value={tax} onChange={e => setTax(Number(e.target.value))} placeholder="0" />
        </div>
        <div className="extra-row">
          <label>Service Charge (%)</label>
          <input type="number" min="0" max="100" step="0.1" value={service} onChange={e => setService(Number(e.target.value))} placeholder="0" />
        </div>
      </div>

      <div className="nav-actions">
        <button className="btn btn-outline" onClick={onBack}>← Kembali</button>
        <button className="btn btn-primary" disabled={!canProceed} onClick={onNext}>
          Lihat Ringkasan →
        </button>
      </div>
    </>
  )
}

// ─── Step 4 – Summary ─────────────────────────────────────────────────────────
function SummaryStep({ items, people, assignments, tax, service, onBack, onReset }) {
  const subtotal = items.reduce((s, it) => s + it.price, 0)
  const taxAmt     = subtotal * (tax / 100)
  const serviceAmt = subtotal * (service / 100)
  const total      = subtotal + taxAmt + serviceAmt

  // Per-person amounts
  const perPerson = people.map(person => {
    let itemsTotal = 0
    const myItems = []

    items.forEach(it => {
      const assignees = assignments[it.id] || []
      if (assignees.includes(person.id)) {
        const share = it.price / assignees.length
        itemsTotal += share
        myItems.push({ name: it.name, share })
      }
    })

    const extraShare = people.length > 0 ? (taxAmt + serviceAmt) / people.length : 0
    return { person, items: myItems, itemsTotal, extra: extraShare, total: itemsTotal + extraShare }
  })

  const [copied, setCopied] = useState(false)

  const copyText = () => {
    const lines = ['🍽️ SplitSmart – Ringkasan Tagihan', '']
    perPerson.forEach(({ person, items: myItems, total: t }) => {
      lines.push(`👤 ${person.name}: ${fmt(t)}`)
      myItems.forEach(i => lines.push(`   • ${i.name}: ${fmt(i.share)}`))
    })
    lines.push('')
    lines.push(`Total: ${fmt(total)}`)
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <div className="card">
        <div className="card-title">📊 Ringkasan Tagihan</div>
        <div className="card-sub">
          Subtotal {fmt(subtotal)}
          {tax > 0 && ` · PPN ${tax}% ${fmt(taxAmt)}`}
          {service > 0 && ` · Service ${service}% ${fmt(serviceAmt)}`}
          {' · '}
          <strong>Total {fmt(total)}</strong>
        </div>

        {perPerson.map(({ person, items: myItems, extra, total: t }) => (
          <div key={person.id} className="summary-person">
            <div className="summary-person-header">
              <div className="summary-person-name">
                <div className="avatar">{person.name[0].toUpperCase()}</div>
                {person.name}
              </div>
              <div className="summary-total">{fmt(t)}</div>
            </div>
            <div className="summary-items">
              {myItems.map((it, i) => (
                <div key={i} className="si-row">
                  <span>{it.name}</span>
                  <span>{fmt(it.share)}</span>
                </div>
              ))}
              {extra > 0 && (
                <div className="si-row tax">
                  <span>Pajak &amp; Service</span>
                  <span>{fmt(extra)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="nav-actions">
        <button className="btn btn-outline" onClick={onBack}>← Kembali</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={copyText}>
            {copied ? '✅ Disalin!' : '📋 Salin'}
          </button>
          <button className="btn btn-primary" onClick={onReset}>
            🔄 Mulai Lagi
          </button>
        </div>
      </div>

      {copied && <div className="toast">Ringkasan disalin ke clipboard!</div>}
    </>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0)
  const [items, setItems] = useState([])
  const [people, setPeople] = useState([])
  const [assignments, setAssignments] = useState({})
  const [tax, setTax] = useState(11)       // PPN default 11%
  const [service, setService] = useState(5) // Service charge default 5%

  const reset = () => {
    setStep(0); setItems([]); setPeople([]); setAssignments({}); setTax(11); setService(5)
  }

  return (
    <>
      <header className="app-header">
        <span className="logo">Split<span>Smart</span></span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>
          Bagi tagihan tanpa ribet 🚀
        </span>
      </header>

      <main className="app-main">
        <Stepper current={step} />

        {step === 0 && (
          <UploadStep items={items} setItems={setItems} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <PeopleStep people={people} setPeople={setPeople} onBack={() => setStep(0)} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <AssignStep
            items={items} people={people}
            assignments={assignments} setAssignments={setAssignments}
            tax={tax} setTax={setTax}
            service={service} setService={setService}
            onBack={() => setStep(1)} onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <SummaryStep
            items={items} people={people}
            assignments={assignments} tax={tax} service={service}
            onBack={() => setStep(2)} onReset={reset}
          />
        )}
      </main>
    </>
  )
}
