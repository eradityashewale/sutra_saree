import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import products from '../data/products.json'
import { track } from './analytics.js'

// "Cart on WhatsApp": a list of saree ids kept in localStorage.
const Ctx = createContext(null)
const KEY = 'saree_enquiry'

export function EnquiryProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids))
    } catch {}
  }, [ids])

  const toggle = useCallback((id) => {
    setIds((cur) => {
      const has = cur.includes(id)
      track(has ? 'enquiry_remove' : 'enquiry_add', { product: id })
      return has ? cur.filter((x) => x !== id) : [...cur, id]
    })
  }, [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({
      ids,
      items: ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
      has: (id) => ids.includes(id),
      toggle,
      clear,
      open,
      setOpen,
    }),
    [ids, open, toggle, clear],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useEnquiry = () => useContext(Ctx)
