import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Users, TrendingUp } from "lucide-react"

export function CardsSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Cards</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Versatile card layouts for displaying content, stats, and user profiles.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Card */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Overview</CardTitle>
            <CardDescription>Track your campaign performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your latest campaign has reached 1,234 donors with a total of $45,600 raised towards the $100,000 goal.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">View Details</Button>
          </CardFooter>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Statistics
            </CardTitle>
            <CardDescription>This month&apos;s progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-foreground">2,847</span>
                <span className="text-xs text-muted-foreground">Total donors</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-primary">$128K</span>
                <span className="text-xs text-muted-foreground">Raised</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-foreground">94%</span>
                <span className="text-xs text-muted-foreground">Goal reached</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold text-foreground">12</span>
                <span className="text-xs text-muted-foreground">Active campaigns</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">AS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Aminata Sidi</CardTitle>
                <CardDescription>donor@ihsan.mr</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge>Donor</Badge>
              <Badge variant="secondary">Verified</Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button size="sm" variant="outline" className="flex-1">
              <Heart className="size-4" /> Follow
            </Button>
            <Button size="sm" className="flex-1">
              <Users className="size-4" /> Message
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
