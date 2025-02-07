import { Loading } from '@/components/ui/loading'

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loading variant="store" size="lg" />
    </div>
  )
}
