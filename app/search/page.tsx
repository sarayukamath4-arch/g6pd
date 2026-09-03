"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EvidenceBadge } from "@/components/ui/EvidenceBadge";
import { CategoryTag } from "@/components/ui/CategoryTag";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const supabase = createClient();

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
        .limit(20);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="EVIDENCE DATABASE"
        title="Search substances"
        subtitle="Explore medicines, foods, supplements and chemicals and see what the available evidence says"
      />

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search a medicine, food, ingredient..."
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

            {searching && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-slate-500 mt-2">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">{searchResults.length} results found</p>
                  <p className="text-xs text-slate-400">Evidence reviewed for G6PD deficiency</p>
                </div>
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
              <EmptyState 
                type="search"
                title="No substance found"
                description="Try another search term. GeneGuide does not infer medical conclusions from unknown substances."
              />
            )}

            {!searchQuery && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Search the evidence database</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Enter a substance name to search our curated database of clinical evidence for G6PD deficiency.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 mb-1">Important Note</p>
            <p className="text-sm text-amber-800">
              This database contains clinical evidence reviewed for G6PD deficiency. Individual responses may vary. 
              Always consult with your healthcare provider before making medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}