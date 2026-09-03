"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { InfoBanner } from "@/components/layout/InfoBanner";
import { EvidenceBadge } from "@/components/ui/EvidenceBadge";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Learn() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const supabase = createClient();

  const quickSuggestions = ["Aspirin", "Fava Beans", "Menthol", "Ascorbic Acid"];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('substances')
        .select(`
          *,
          condition_evidence (
            evidence_level,
            clinical_summary,
            source_citation
          )
        `)
        .or(`canonical_name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleQuickSearch = (suggestion: string) => {
    handleSearch(suggestion);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="LEARN"
        title="G6PD Deficiency Reference Guide"
        subtitle="Evidence-based information about substances and your condition"
        action={
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Knowledge Score: 0%</span>
          </div>
        }
      />

      {/* Search Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search medication, food, or chemical name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Clear
                </Button>
              )}
            </div>

            {!searchQuery && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">Quick search:</span>
                {quickSuggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSearch(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}

            {searching && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-slate-500 mt-2">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">{searchResults.length} results found</p>
                {searchResults.map((substance) => (
                  <Card key={substance.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{substance.canonical_name}</h3>
                            <CategoryTag category={substance.category as any} />
                          </div>
                          <p className="text-sm text-slate-600">{substance.description}</p>
                        </div>
                        {substance.condition_evidence && substance.condition_evidence[0] && (
                          <EvidenceBadge level={substance.condition_evidence[0].evidence_level as any} />
                        )}
                      </div>
                      {substance.condition_evidence && substance.condition_evidence[0] && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-xs text-slate-600 mb-1">
                            <strong>Clinical Evidence:</strong> {substance.condition_evidence[0].clinical_summary}
                          </p>
                          <p className="text-xs text-slate-400">
                            Source: {substance.condition_evidence[0].source_citation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchQuery && !searching && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">No results found for "{searchQuery}"</p>
                <p className="text-sm text-slate-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Educational Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Educational Modules</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[
            { id: 1, title: "Understanding Hemolysis", description: "Learn what happens when red blood cells break down" },
            { id: 2, title: "Navigating Food Labels", description: "How to identify potential triggers in packaged foods" },
            { id: 3, title: "Medication Safety", description: "Working with healthcare providers on safe treatments" },
            { id: 4, title: "Emergency Recognition", description: "Identifying symptoms that require immediate attention" },
          ].map((module) => (
            <Link key={module.id} href={`/learn/quiz/${module.id}`} className="block">
              <Card className="min-w-[280px] hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{module.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-emerald-600">
                        Start lesson <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Important Distinction Banner */}
      <InfoBanner type="info" title="Important distinction">
        Educational information describes what research says about a substance. Your journal records 
        what happened to you. These are kept separate because a personal reaction does not prove causation.
      </InfoBanner>
    </div>
  );
}