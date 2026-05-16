import { Nav } from "@/components/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, Users, DollarSign, Activity, AlertTriangle, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#59c378]/10 border border-[#59c378]/20">
                <Sparkles className="h-6 w-6 text-[#59c378]" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight font-display text-[#f8fafc]">
                Retain AI
              </h1>
            </div>
            <p className="text-lg text-[#94a3b8] max-w-3xl leading-relaxed">
              AI-powered analytics copilot for live game telemetry. Real-time player retention, 
              monetization insights, and LiveOps recommendations.
            </p>
          </div>

          {/* KPI Cards - Premium Layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-[#94a3b8]">Total Players</CardTitle>
                <div className="p-2 rounded-lg bg-[#3b82f6]/10">
                  <Users className="h-4 w-4 text-[#3b82f6]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-[#f8fafc] mb-2">45,231</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-[#59c378]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-semibold">+20.1%</span>
                  </div>
                  <span className="text-[#64748b]">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-[#94a3b8]">Revenue</CardTitle>
                <div className="p-2 rounded-lg bg-[#59c378]/10">
                  <DollarSign className="h-4 w-4 text-[#59c378]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-[#f8fafc] mb-2">$54,239</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-[#59c378]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-semibold">+12.5%</span>
                  </div>
                  <span className="text-[#64748b]">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-[#94a3b8]">Active Sessions</CardTitle>
                <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                  <Activity className="h-4 w-4 text-[#f59e0b]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-[#f8fafc] mb-2">2,350</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-[#59c378]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-semibold">+8.2%</span>
                  </div>
                  <span className="text-[#64748b]">vs last hour</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-medium text-[#94a3b8]">Retention Rate</CardTitle>
                <div className="p-2 rounded-lg bg-[#59c378]/10">
                  <ArrowUpRight className="h-4 w-4 text-[#59c378]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-[#f8fafc] mb-2">68.4%</div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-[#59c378]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="font-semibold">+4.3%</span>
                  </div>
                  <span className="text-[#64748b]">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area - Premium Layout */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Analytics Overview - Takes 2 columns */}
            <Card className="card-premium hover-lift border-[#1f2937] bg-[#121826] lg:col-span-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-[#f8fafc] mb-1">
                      Player Retention Analytics
                    </CardTitle>
                    <CardDescription className="text-[#94a3b8]">
                      AI-powered insights from gameplay telemetry
                    </CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-[#59c378]/10">
                    <Sparkles className="h-5 w-5 text-[#59c378]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center rounded-xl border-2 border-dashed border-[#1f2937] bg-[#0b1020]/50 transition-all hover:border-[#59c378]/30">
                  <div className="text-center px-6">
                    <div className="mb-4 inline-flex p-4 rounded-2xl bg-[#59c378]/10">
                      <Activity className="h-12 w-12 text-[#59c378]" />
                    </div>
                    <p className="text-lg font-semibold text-[#f8fafc] mb-2">
                      Upload Telemetry Data
                    </p>
                    <p className="text-sm text-[#94a3b8] mb-6 max-w-md">
                      Start analyzing player behavior with AI-powered insights. 
                      Upload your CSV telemetry data to unlock retention analytics.
                    </p>
                    <Link href="/upload">
                      <Button className="bg-[#59c378] hover:bg-[#6dd389] text-white font-medium px-6 py-2 transition-smooth">
                        <Zap className="h-4 w-4 mr-2" />
                        Upload Data
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Alerts - Takes 1 column */}
            <Card className="card-premium hover-lift border-[#1f2937] bg-[#121826]">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-[#f8fafc] mb-1">
                  Live Alerts
                </CardTitle>
                <CardDescription className="text-[#94a3b8]">
                  Real-time insights & anomalies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { 
                      type: "warning", 
                      text: "High churn risk detected", 
                      time: "2 min ago", 
                      icon: AlertTriangle, 
                      color: "text-[#f59e0b]",
                      bg: "bg-[#f59e0b]/10"
                    },
                    { 
                      type: "info", 
                      text: "New player cohort active", 
                      time: "5 min ago", 
                      icon: Users, 
                      color: "text-[#3b82f6]",
                      bg: "bg-[#3b82f6]/10"
                    },
                    { 
                      type: "success", 
                      text: "Revenue milestone reached", 
                      time: "12 min ago", 
                      icon: DollarSign, 
                      color: "text-[#59c378]",
                      bg: "bg-[#59c378]/10"
                    },
                    { 
                      type: "info", 
                      text: "Session spike detected", 
                      time: "18 min ago", 
                      icon: Activity, 
                      color: "text-[#3b82f6]",
                      bg: "bg-[#3b82f6]/10"
                    },
                    { 
                      type: "warning", 
                      text: "Friction point identified", 
                      time: "25 min ago", 
                      icon: AlertTriangle, 
                      color: "text-[#f59e0b]",
                      bg: "bg-[#f59e0b]/10"
                    },
                  ].map((activity, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#1f2937]/30 transition-smooth cursor-pointer group"
                    >
                      <div className={`p-2 rounded-lg ${activity.bg} ${activity.color} transition-smooth group-hover:scale-110`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#f8fafc] leading-tight mb-1">
                          {activity.text}
                        </p>
                        <p className="text-xs text-[#64748b] font-mono">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="card-premium hover-lift border-[#1f2937] bg-[#121826]">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-[#f8fafc] mb-1">
                Quick Actions
              </CardTitle>
              <CardDescription className="text-[#94a3b8]">
                Common LiveOps and analytics operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Link href="/upload">
                  <Button className="bg-[#59c378] hover:bg-[#6dd389] text-white font-medium transition-smooth hover-scale">
                    <Zap className="h-4 w-4 mr-2" />
                    Upload Telemetry
                  </Button>
                </Link>
                <Button variant="outline" className="border-[#1f2937] hover:border-[#59c378]/30 hover:bg-[#59c378]/5 transition-smooth hover-scale">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate AI Insights
                </Button>
                <Button variant="outline" className="border-[#1f2937] hover:border-[#59c378]/30 hover:bg-[#59c378]/5 transition-smooth hover-scale">
                  Export Report
                </Button>
                <Button variant="outline" className="border-[#1f2937] hover:border-[#59c378]/30 hover:bg-[#59c378]/5 transition-smooth hover-scale">
                  View Cohorts
                </Button>
                <Button variant="outline" className="border-[#1f2937] hover:border-[#59c378]/30 hover:bg-[#59c378]/5 transition-smooth hover-scale">
                  LiveOps Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

// Made with Bob
