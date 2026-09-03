import { createClient } from './supabase/client';

export interface IngredientPattern {
  ingredient_name: string;
  frequency: number;
  total_entries: number;
  percentage: number;
  matched_substance_id?: string;
  substance_category?: string;
  evidence_level?: string;
  severity_distribution: {
    Mild: number;
    Moderate: number;
    Severe: number;
  };
}

export interface PatternInsights {
  total_entries: number;
  date_range: {
    start: string;
    end: string;
  };
  common_ingredients: IngredientPattern[];
  severity_summary: {
    Mild: number;
    Moderate: number;
    Severe: number;
  };
  time_distribution: {
    date: string;
    count: number;
  }[];
}

export async function analyzePatterns(userId: string): Promise<PatternInsights> {
  const supabase = createClient();

  try {
    // Get all journal entries with ingredients
    const { data: entries, error: entriesError } = await supabase
      .from('journal_entries')
      .select(`
        *,
        journal_ingredients (
          ingredient_name,
          matched_substance_id
        )
      `)
      .eq('user_id', userId)
      .order('exposure_date', { ascending: true });

    if (entriesError) throw entriesError;

    if (!entries || entries.length === 0) {
      return {
        total_entries: 0,
        date_range: { start: '', end: '' },
        common_ingredients: [],
        severity_summary: { Mild: 0, Moderate: 0, Severe: 0 },
        time_distribution: [],
      };
    }

    // Calculate date range
    const dates = entries.map(e => new Date(e.exposure_date));
    const dateRange = {
      start: new Date(Math.min(...dates.map(d => d.getTime()))).toISOString().split('T')[0],
      end: new Date(Math.max(...dates.map(d => d.getTime()))).toISOString().split('T')[0],
    };

    // Calculate severity summary
    const severitySummary = entries.reduce((acc, entry) => {
      acc[entry.severity as keyof typeof acc] = (acc[entry.severity as keyof typeof acc] || 0) + 1;
      return acc;
    }, { Mild: 0, Moderate: 0, Severe: 0 });

    // Calculate time distribution (group by date)
    const timeMap = new Map<string, number>();
    entries.forEach(entry => {
      const date = new Date(entry.exposure_date).toISOString().split('T')[0];
      timeMap.set(date, (timeMap.get(date) || 0) + 1);
    });
    const timeDistribution = Array.from(timeMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate ingredient frequencies
    const ingredientMap = new Map<string, {
      count: number;
      severityDistribution: { Mild: number; Moderate: number; Severe: number };
      matched_substance_id?: string;
    }>();

    entries.forEach(entry => {
      if (entry.journal_ingredients) {
        entry.journal_ingredients.forEach((ing: any) => {
          const existing = ingredientMap.get(ing.ingredient_name) || {
            count: 0,
            severityDistribution: { Mild: 0, Moderate: 0, Severe: 0 },
            matched_substance_id: ing.matched_substance_id,
          };
          existing.count++;
          existing.severityDistribution[entry.severity as keyof typeof existing.severityDistribution]++;
          ingredientMap.set(ing.ingredient_name, existing);
        });
      }
    });

    // Get substance data for matched ingredients
    const ingredientNames = Array.from(ingredientMap.keys());
    const { data: substances } = await supabase
      .from('substances')
      .select('canonical_name, category, condition_evidence (evidence_level)')
      .in('canonical_name', ingredientNames);

    const substanceMap = new Map(
      substances?.map(s => [
        s.canonical_name,
        {
          category: s.category,
          evidence_level: s.condition_evidence?.[0]?.evidence_level,
        },
      ]) || []
    );

    // Build common ingredients list
    const commonIngredients: IngredientPattern[] = Array.from(ingredientMap.entries())
      .map(([name, data]) => {
        const substance = substanceMap.get(name);
        return {
          ingredient_name: name,
          frequency: data.count,
          total_entries: entries.length,
          percentage: (data.count / entries.length) * 100,
          matched_substance_id: data.matched_substance_id,
          substance_category: substance?.category,
          evidence_level: substance?.evidence_level,
          severity_distribution: data.severityDistribution,
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Top 10 most common

    return {
      total_entries: entries.length,
      date_range: dateRange,
      common_ingredients: commonIngredients,
      severity_summary: severitySummary,
      time_distribution: timeDistribution,
    };
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    throw error;
  }
}

export function detectCorrelations(insights: PatternInsights): string[] {
  const correlations: string[] = [];

  // High-frequency ingredients with severe reactions
  insights.common_ingredients.forEach(ingredient => {
    if (ingredient.frequency >= 2 && ingredient.severity_distribution.Severe > 0) {
      correlations.push(
        `"${ingredient.ingredient_name}" appears in ${ingredient.frequency} entries with severe reactions. Consider discussing with your healthcare provider.`
      );
    }

    // Ingredients with high evidence level and reactions
    if (ingredient.evidence_level === 'High Risk' && ingredient.frequency >= 2) {
      correlations.push(
        `"${ingredient.ingredient_name}" is a known high-risk substance for G6PD deficiency and appears in ${ingredient.frequency} of your entries.`
      );
    }
  });

  // Severity escalation pattern
  const moderateCount = insights.severity_summary.Moderate;
  const severeCount = insights.severity_summary.Severe;
  if (moderateCount > 0 && severeCount > 0) {
    const ratio = severeCount / (moderateCount + severeCount);
    if (ratio > 0.3) {
      correlations.push(
        `${Math.round(ratio * 100)}% of your reactions are severe. Monitor your symptoms closely and consider medical consultation.`
      );
    }
  }

  return correlations;
}