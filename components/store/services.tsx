import Image from 'next/image';
import { Clock, Fish, Truck, MapPin } from "lucide-react"

const features = [
  {
    icon: Fish,
    title: "Fresh Daily",
    description: "Our sushi is made fresh every morning using premium ingredients sourced locally and from Japan.",
  },
  {
    icon: Clock,
    title: "Quick Pickup",
    description: "Order ahead online and pick up at our counter inside H Mart. Ready in 15 minutes or less.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Get fresh sushi delivered to your door through UberEats, DoorDash, or Grubhub.",
  },
  {
    icon: MapPin,
    title: "Convenient Location",
    description: "Find us inside H Mart Asian Market. Easy parking and accessible from the main entrance.",
  },
]

const Services: React.FC = () => {
    return (
         <section className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Why Choose Us
          </p>
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl text-balance">
            Fresh sushi, your way
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-4 bg-background p-8 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
                <feature.icon className="h-5 w-5 text-background" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    );
}

export default Services;
