import { useEffect, useMemo, useState } from 'react'
import {
  expectedCash,
  loadShiftState,
  saveShiftState,
  SHIFT_STORAGE_KEY,
  shiftSales,
  shiftSummarySnapshot,
} from '@/constants/moonCafeRegister'
import { salesSummary } from '@/constants/moonCafeSales'
import { genId } from '@/hooks/useMoonCafeShowcase'

// Register shift for Café Moon's Caja: opening float, cash in/out, closing count and
// the history of closed shifts. `sales` comes from useMoonCafePos so both stay in sync.
export default function useMoonCafeShift(sales) {
  const [state, setState] = useState(loadShiftState)

  useEffect(() => {
    const onStorage = (e) => e.key === SHIFT_STORAGE_KEY && setState(loadShiftState())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = (fn) => {
    const next = fn(loadShiftState())
    saveShiftState(next)
    setState(next)
    return next
  }

  const shift = state.current

  const openShift = ({ cashier_id, store_id, opening_cash }) =>
    update((prev) => ({
      ...prev,
      current: {
        id: genId(),
        store_id,
        cashier_id,
        opened_at: new Date().toISOString(),
        opening_cash: Number(opening_cash) || 0,
        movements: [],
      },
    }))

  const addMovement = ({ type, amount, reason }) =>
    update((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        movements: [
          ...prev.current.movements,
          { id: genId(), type, amount: Number(amount), reason, at: new Date().toISOString() },
        ],
      },
    }))

  const setCashier = (cashier_id) => update((prev) => ({ ...prev, current: { ...prev.current, cashier_id } }))

  // Closes the shift and returns it with its counted cash, difference and summary.
  const closeShift = ({ counted_cash, note }) => {
    const current = loadShiftState().current
    const closed = { ...current, closed_at: new Date().toISOString() }
    const expected = expectedCash(closed, sales).total
    const report = {
      ...closed,
      expected_cash: expected,
      counted_cash: Number(counted_cash) || 0,
      difference: (Number(counted_cash) || 0) - expected,
      note: note?.trim() ?? '',
      summary: shiftSummarySnapshot(closed, sales),
    }
    update((prev) => ({ current: null, history: [report, ...prev.history] }))
    return report
  }

  const expected = useMemo(() => (shift ? expectedCash(shift, sales) : null), [shift, sales])
  const summary = useMemo(() => (shift ? salesSummary(shiftSales(shift, sales)) : null), [shift, sales])

  return { shift, history: state.history, expected, summary, openShift, addMovement, setCashier, closeShift }
}
