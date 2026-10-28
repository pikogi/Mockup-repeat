import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { toast } from 'sonner'
import { CheckoutSuccessDialog, PosCatalog, PosTicket, SalesToday } from '@/components/pos/PosSections'
import {
  CashMovementDialog,
  ChangeCashierDialog,
  CloseShiftDialog,
  OpenShiftPanel,
  ShiftBar,
  ShiftClosedDialog,
  ShiftHistory,
} from '@/components/pos/RegisterSections'
import { OpenTabsStrip } from '@/components/pos/TicketExtras'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatShowcasePrice } from '@/constants/moonCafeShowcase'
import { cashierName } from '@/constants/moonCafeTeam'
import useMoonCafePos from '@/hooks/useMoonCafePos'
import useMoonCafeShift from '@/hooks/useMoonCafeShift'

export default function CajaMoonCafe() {
  const pos = useMoonCafePos()
  const register = useMoonCafeShift(pos.sales)
  const { shift } = register
  const [result, setResult] = useState(null)
  const [ticketOpen, setTicketOpen] = useState(false)
  const [movementOpen, setMovementOpen] = useState(false)
  const [cashierOpen, setCashierOpen] = useState(false)
  const [closeOpen, setCloseOpen] = useState(false)
  const [closedReport, setClosedReport] = useState(null)

  const handleCheckout = () => {
    setTicketOpen(false)
    setResult(pos.checkout(shift))
  }

  const handleSaveToTab = (table) => {
    pos.saveToTab(table, shift?.cashier_id)
    setTicketOpen(false)
    toast.success(`Cuenta guardada en ${table}`)
  }

  const handleOpenTab = (id) => {
    if (pos.lines.length > 0 && !pos.activeTab) {
      toast('Primero cobra o guarda en una mesa el ticket actual')
      return
    }
    pos.openTab(id)
  }

  const handleVoid = (sale, reason) => {
    pos.voidSale(sale, reason, shift?.cashier_id)
    toast.success(`Ticket #${sale.number} anulado`)
  }

  const handleClose = (data) => {
    pos.resetTicket()
    setCloseOpen(false)
    setClosedReport(register.closeShift(data))
  }

  const units = pos.lines.reduce((sum, l) => sum + l.qty, 0)

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10 pb-28 lg:pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
            <Receipt className="w-8 h-8" /> Caja
          </h1>
          <p className="text-gray-500 mt-1">Cobra, identifica a tu cliente y suma sus sellos en un solo paso.</p>
        </div>

        {shift && (
          <ShiftBar
            shift={shift}
            expected={register.expected}
            onMovement={() => setMovementOpen(true)}
            onChangeCashier={() => setCashierOpen(true)}
            onClose={() => setCloseOpen(true)}
          />
        )}

        <Tabs defaultValue="caja">
          <TabsList className="mb-6">
            <TabsTrigger value="caja">Caja</TabsTrigger>
            <TabsTrigger value="ventas">Ventas de hoy ({pos.summary.count})</TabsTrigger>
            <TabsTrigger value="cierres">Cierres</TabsTrigger>
          </TabsList>

          <TabsContent value="caja">
            {shift ? (
              <div className="flex gap-6 items-start">
                <div className="flex-1 min-w-0 space-y-4">
                  <OpenTabsStrip tabs={pos.tabs} activeTabId={pos.activeTab?.id} onOpen={handleOpenTab} />
                  <PosCatalog
                    catalog={pos.catalog}
                    categories={pos.categories}
                    onAdd={pos.addItem}
                    onCustom={pos.addCustomLine}
                  />
                </div>
                <aside className="hidden lg:block w-[380px] flex-shrink-0 sticky top-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 max-h-[calc(100vh-3rem)] overflow-y-auto">
                  <PosTicket pos={pos} onCheckout={handleCheckout} onSaveToTab={handleSaveToTab} />
                </aside>
              </div>
            ) : (
              <OpenShiftPanel
                lastClosed={register.history[0]}
                onOpen={(data) => {
                  register.openShift(data)
                  toast.success(`Caja abierta por ${cashierName(data.cashier_id)}`)
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="ventas">
            <SalesToday sales={pos.todaySales} summary={pos.summary} onVoid={handleVoid} />
          </TabsContent>

          <TabsContent value="cierres">
            <ShiftHistory history={register.history} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile: the ticket lives in a bottom sheet behind a floating bar. */}
      {shift && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-950 dark:via-gray-950/95">
          <button
            onClick={() => setTicketOpen(true)}
            className="w-full h-12 rounded-xl bg-emerald-700 text-white font-semibold flex items-center justify-between px-4 shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Receipt className="w-4 h-4" /> {pos.activeTab ? pos.activeTab.table : 'Ver ticket'}{' '}
              {units > 0 && `(${units})`}
            </span>
            <span className="tabular-nums">{formatShowcasePrice(pos.charge)}</span>
          </button>
        </div>
      )}
      <Sheet open={ticketOpen} onOpenChange={setTicketOpen}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-2xl">
          <SheetTitle className="sr-only">Ticket</SheetTitle>
          <PosTicket pos={pos} onCheckout={handleCheckout} onSaveToTab={handleSaveToTab} />
        </SheetContent>
      </Sheet>

      <CheckoutSuccessDialog result={result} onClose={() => setResult(null)} />

      {shift && (
        <>
          <CashMovementDialog
            open={movementOpen}
            onOpenChange={setMovementOpen}
            onSave={(m) => {
              register.addMovement(m)
              toast.success(`${m.type === 'out' ? 'Retiro' : 'Ingreso'} de ${formatShowcasePrice(m.amount)} registrado`)
            }}
          />
          <ChangeCashierDialog
            open={cashierOpen}
            onOpenChange={setCashierOpen}
            current={shift.cashier_id}
            onSelect={register.setCashier}
          />
          {closeOpen && (
            <CloseShiftDialog
              open
              onOpenChange={setCloseOpen}
              shift={shift}
              expected={register.expected}
              summary={register.summary}
              onConfirm={handleClose}
            />
          )}
        </>
      )}
      <ShiftClosedDialog report={closedReport} onClose={() => setClosedReport(null)} />
    </div>
  )
}
