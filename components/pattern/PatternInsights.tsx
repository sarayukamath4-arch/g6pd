"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/ui/EvidenceBadge";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AlertTriangle, TrendingUp, Calendar, Activity, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { analyzePatterns, detectCorrelations, type PatternInsights } from "@/lib/patternAnalysis";
import { exportPatternsAsJSON, exportPatternsAsCSV, downloadJSON, downloadCSV } from "@/lib/patternExport";

export function PatternInsightsDashboard() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PatternInsights | null>(null);
  const [correlations, setCorrelations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadPatterns = async () => {
      try {
        const data = await analyzePatterns(user.id);
        setInsights(data);
        setCorrelations(detectCorrelations(data));
      } catch (error) {
        console.error('Error loading patterns:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatterns();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="text-sm text-slate-500 mt-2">Analyzing patterns...</p>
      </div>
    );
  }

  if (!insights || insights.total_entries === 0) {
    return (
      <EmptyState 
        type="journal"
        title="No patterns to analyze"
        description="Log more reactions to identify shared ingredients and patterns."
      />
    );
  }

  const severityTotal = Object.values(insights.severity_summary).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Entries</p>
                <p className="text-2xl font-bold text-slate-900">{insights.total_entries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Date Range</p>
                <p className="text-sm font-semibold text-slate-900">
                  {insights.date_range.start} - {insights.date_range.end}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Common Ingredients</p>
                <p className="text-2xl font-bold text-slate-900">{insights.common_ingredients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Export Data</p>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadJSON(exportPatternsAsJSON(insights))}
                  >
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadCSV(exportPatternsAsCSV(insights))}
                  >
                    CSV
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Warnings */}
      {correlations.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5" />
              Pattern Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {correlations.map((correlation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="font-bold">•</span>
                  <span>{correlation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Severity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(['Mild', 'Moderate', 'Severe'] as const).map((severity) => {
              const count = insights.severity_summary[severity];
              const percentage = severityTotal > 0 ? (count / severityTotal) * 100 : 0;
              return (
                <div key={severity}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={severity} />
                      <span className="text-sm text-slate-600">{count} entries</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        severity === 'Mild' ? 'bg-green-500' :
                        severity === 'Moderate' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Common Ingredients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Most Common Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.common_ingredients.map((ingredient, index) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{ingredient.ingredient_name}</h3>
                      {ingredient.substance_category && (
                        <CategoryTag category={ingredient.substance_category as any} />
                      )}
                      {ingredient.evidence_level && (
                        <EvidenceBadge level={ingredient.evidence_level as any} />
                      )}
                    </div>
                    <p className="text-sm text-slate-600">
                      Appears in {ingredient.frequency} of {ingredient.total_entries} entries ({Math.round(ingredient.percentage)}%)
                    </p>
                  </div>
                  <Badge variant="outline">
                    #{index + 1}
                  </Badge>
                </div>

                {/* Severity Distribution for this ingredient */}
                <div className="flex gap-2 mt-2">
                  {(['Mild', 'Moderate', 'Severe'] as const).map((severity) => {
                    const count = ingredient.severity_distribution[severity];
                    if (count === 0) return null;
                    return (
                      <div key={severity} className="flex items-center gap-1">
                        <SeverityBadge severity={severity} />
                        <span className="text-xs text-slate-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reactions Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {insights.time_distribution.length > 0 ? (
            <div className="space-y-2">
              {insights.time_distribution.map((entry, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 w-24">{entry.date}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-4">
                    <div
                      className="bg-emerald-500 h-4 rounded-full transition-all"
                      style={{ width: `${(entry.count / Math.max(...insights.time_distribution.map(t => t.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-8">{entry.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No time data available</p>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Important Disclaimer</p>
            <p className="text-sm text-blue-800">
              These patterns show correlations, not causation. An ingredient appearing multiple times does not prove it caused your reactions. 
              Always consult with your healthcare provider for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}