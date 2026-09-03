"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { InfoBanner } from "@/components/layout/InfoBanner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PatternInsightsDashboard } from "@/components/pattern/PatternInsights";
import { AlertCircle, Calendar, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

type JournalEntry = {
  id: string;
  product_name: string;
  exposure_date: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms_description: string;
  label_image_url?: string;
  created_at: string;
  journal_ingredients?: {
    ingredient_name: string;
    matched_substance_id?: string;
  }[];
};

export default function Journal() {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [productName, setProductName] = useState("");
  const [exposureDate, setExposureDate] = useState("");
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [symptoms, setSymptoms] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check for scan data from scanner
  useEffect(() => {
    const scanData = sessionStorage.getItem('pending-scan-data');
    if (scanData) {
      const data = JSON.parse(scanData);
      setProductName(data.productName);
      setIngredients(data.ingredients);
      setExposureDate(data.exposureDate);
      // Clear the stored data after using it
      sessionStorage.removeItem('pending-scan-data');
    }
  }, []);

  // Load journal entries
  useEffect(() => {
    if (!user) return;

    const loadEntries = async () => {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select(`
            *,
            journal_ingredients (
              ingredient_name,
              matched_substance_id
            )
          `)
          .eq('user_id', user.id)
          .order('exposure_date', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error loading entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, [user, supabase]);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !productName || !exposureDate) return;

    setSubmitting(true);

    try {
      // Create journal entry
      const { data: entry, error: entryError } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          product_name: productName,
          exposure_date: new Date(exposureDate).toISOString(),
          severity,
          symptoms_description: symptoms,
        })
        .select()
        .single();

      if (entryError) throw entryError;

      // Add ingredients
      if (ingredients.length > 0) {
        const ingredientInserts = ingredients.map(ing => ({
          journal_id: entry.id,
          ingredient_name: ing,
          is_custom: true
        }));

        const { error: ingredientsError } = await supabase
          .from('journal_ingredients')
          .insert(ingredientInserts);

        if (ingredientsError) throw ingredientsError;
      }

      // Reload entries
      const { data: updatedEntries } = await supabase
        .from('journal_entries')
        .select(`
          *,
          journal_ingredients (
            ingredient_name,
            matched_substance_id
          )
        `)
        .eq('user_id', user.id)
        .order('exposure_date', { ascending: false });

      setEntries(updatedEntries || []);

      // Reset form
      setProductName("");
      setExposureDate("");
      setSeverity('Mild');
      setSymptoms("");
      setIngredients([]);
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  if (!user) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <PageHeader
          eyebrow="AUTHENTICATION REQUIRED"
          title="Please sign in"
          subtitle="You need to be signed in to access your journal"
        />
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Sign in to access your reaction journal</p>
          <Button onClick={() => window.location.href = '/auth/login'} className="bg-emerald-600 hover:bg-emerald-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="PERSONAL OBSERVATIONS"
        title="Reaction journal"
        subtitle="Track your personal reactions and identify patterns"
      />

      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList>
          <TabsTrigger value="timeline">Reaction Timeline</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">New Observation</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product or exposure</Label>
                      <Input
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. medication, food, cosmetic..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity</Label>
                      <select
                        id="severity"
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="w-full p-2 border border-slate-200 rounded-lg"
                        required
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exposureDate">Date</Label>
                      <Input
                        id="exposureDate"
                        type="date"
                        value={exposureDate}
                        onChange={(e) => setExposureDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms description</Label>
                      <Textarea
                        id="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="What did you experience?"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ingredients</Label>
                      <div className="space-y-2">
                        {ingredients.map((ingredient, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                            <span className="flex-1 text-sm">{ingredient}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIngredient(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                          placeholder="Add ingredient..."
                          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addIngredient}
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                      {submitting ? "Saving..." : "Save observation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : entries.length === 0 ? (
                    <EmptyState 
                      type="journal"
                      title="No observations yet"
                      description="Scan a product label or log a reaction to start tracking patterns."
                    />
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry) => (
                        <Card key={entry.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{entry.product_name}</h3>
                                <p className="text-sm text-slate-500">{new Date(entry.exposure_date).toLocaleDateString()}</p>
                              </div>
                              <SeverityBadge severity={entry.severity} />
                            </div>
                            
                            {entry.symptoms_description && (
                              <p className="text-sm text-slate-600 mb-3">{entry.symptoms_description}</p>
                            )}
                            
                            {entry.journal_ingredients && entry.journal_ingredients.length > 0 && (
                              <div className="mb-3">
                                <details className="group">
                                  <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                                    Ingredients ({entry.journal_ingredients.length})
                                  </summary>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {entry.journal_ingredients.map((ing, idx) => (
                                      <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded">
                                        {ing.ingredient_name}
                                      </span>
                                    ))}
                                  </div>
                                </details>
                              </div>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <InfoBanner type="info" title="Correlation ≠ causation">
            If the same ingredient appears across several observations, GeneGuide can highlight 
            the pattern. It cannot determine that the ingredient caused your reaction.
          </InfoBanner>
        </TabsContent>

        <TabsContent value="patterns">
          <PatternInsightsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}