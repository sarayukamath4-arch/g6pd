import { PatternInsights } from './patternAnalysis';

export function exportPatternsAsJSON(insights: PatternInsights): string {
  return JSON.stringify(insights, null, 2);
}

export function exportPatternsAsCSV(insights: PatternInsights): string {
  const headers = ['Ingredient Name', 'Frequency', 'Percentage', 'Category', 'Evidence Level', 'Mild Count', 'Moderate Count', 'Severe Count'];
  
  const rows = insights.common_ingredients.map(ing => [
    ing.ingredient_name,
    ing.frequency,
    ing.percentage.toFixed(2),
    ing.substance_category || 'Unknown',
    ing.evidence_level || 'Unknown',
    ing.severity_distribution.Mild,
    ing.severity_distribution.Moderate,
    ing.severity_distribution.Severe,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadJSON(content: string, filename: string = 'geneguide-patterns.json') {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSV(content: string, filename: string = 'geneguide-patterns.csv') {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}