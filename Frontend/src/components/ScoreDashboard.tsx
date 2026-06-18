import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

export interface ScoreData {
  readability: number
  performance: number
  security: number
  bestPractices: number
  reasons: {
    readability: string
    performance: string
    security: string
    bestPractices: string
  }
}

export default function ScoreDashboard({ data }: { data: ScoreData }) {
  const chartData = [
    { subject: "Readability", A: data.readability, fullMark: 10 },
    { subject: "Performance", A: data.performance, fullMark: 10 },
    { subject: "Security", A: data.security, fullMark: 10 },
    { subject: "Best Practices", A: data.bestPractices, fullMark: 10 },
  ]

  const total = data.readability + data.performance + data.security + data.bestPractices
  const overallScore = Math.round((total / 40) * 10) // 0-10 scale

  const getColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 5) return "bg-amber-500"
    return "bg-red-500"
  }
  
  const getTextColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 5) return "text-amber-500"
    return "text-red-500"
  }

  const getGaugeColor = (score: number) => {
    if (score >= 8) return "stroke-green-500"
    if (score >= 5) return "stroke-amber-500"
    return "stroke-red-500"
  }

  // Calculate SVG stroke-dasharray for circular progress
  const circumference = 2 * Math.PI * 36
  const strokeDashoffset = circumference - (overallScore / 10) * circumference

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0c0c10] shadow-lg">
      <div className="border-b border-white/5 bg-white/5 px-6 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-white">
          <span className="text-brand">📊</span> Code Health Analytics
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2">
        {/* Left Side: Charts */}
        <div className="flex flex-col gap-6">
          {/* Overall Health Gauge */}
          <div className="flex items-center gap-6 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="relative size-24 shrink-0">
              {/* Background circle */}
              <svg className="size-full rotate-[-90deg]" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  className="fill-none stroke-white/10"
                  strokeWidth="8"
                />
                {/* Foreground circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  className={`fill-none ${getGaugeColor(overallScore)} transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${getTextColor(overallScore)}`}>
                  {overallScore}
                </span>
                <span className="text-[10px] uppercase text-muted-foreground/80">/ 10</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white">Overall Score</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Aggregate health of the code based on 4 key metrics.
              </p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="flex h-[200px] items-center justify-center rounded-lg border border-white/5 bg-white/[0.02]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar 
                  name="Score" 
                  dataKey="A" 
                  stroke="#7C3AED" 
                  fill="#8B5CF6" 
                  fillOpacity={0.4} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Detailed Breakdown */}
        <div className="flex flex-col justify-center space-y-5 rounded-lg border border-white/5 bg-white/[0.02] p-5">
          <h4 className="mb-2 text-sm font-medium text-white">Detailed Breakdown</h4>
          
          {[
            { label: "Readability", score: data.readability, reason: data.reasons.readability },
            { label: "Performance", score: data.performance, reason: data.reasons.performance },
            { label: "Security", score: data.security, reason: data.reasons.security },
            { label: "Best Practices", score: data.bestPractices, reason: data.reasons.bestPractices },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-sm font-medium text-white/90">{item.label}</span>
                <span className="text-xs text-white/50">{item.reason}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div 
                    className={`h-full rounded-full ${getColor(item.score)} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.score * 10}%` }}
                  />
                </div>
                <span className={`w-8 text-right text-sm font-bold ${getTextColor(item.score)}`}>
                  {item.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
