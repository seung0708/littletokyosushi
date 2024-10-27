import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, CreditCard, Activity, ArrowUpRight, } from 'lucide-react'

import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table'

import Summary from './summary/summary';

const DashboardPage: React.FC = () => {
    return(
      <section className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Summary />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        
        
      </div>
    </section>
    )
}

export default DashboardPage