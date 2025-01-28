import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AnimatePresence, motion } from "framer-motion"
import ActionButtons from "./action-buttons"

interface OrderFooterProps {
    order: any
    onMarkReady: () => void
    onPrint: () => void
    isConfirmed: boolean
    form: any
    onSubmit: (values: any) => void
    onComplete: () => void
  }

export default function OrderFooter({order, onMarkReady, onPrint, isConfirmed, form, onSubmit, onComplete}: OrderFooterProps) {
    return (
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-r-none h-10"
                        onClick={() => {
                          const newValue = Math.max(5, (field.value || 0) - 5);
                          field.onChange(newValue);
                        }}
                      >
                        -
                      </Button>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={5}
                          max={60}
                          step={5}
                          className="rounded-none w-[80px] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          {...field}
                          onChange={(e) => {
                            const value = Math.round(e.target.valueAsNumber / 5) * 5;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-l-none h-10"
                        onClick={() => {
                          const newValue = Math.min(180, (field.value || 0) + 5);
                          field.onChange(newValue);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <AnimatePresence>
                {!isConfirmed && order.status === 'not_started' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full"
                  >
                    <Button type="submit" className="w-full">
                      Confirm Prep Time
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <ActionButtons order={order} onMarkReady={onMarkReady} onPrint={onPrint} onComplete={onComplete} />
            </div>
          </form>
        </Form>
      </CardFooter>
    )
}