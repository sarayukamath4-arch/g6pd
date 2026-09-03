import { pdf } from '@react-pdf/renderer';
import { DoctorReportPDF } from '@/components/pdf/DoctorReportPDF';

interface JournalEntry {
  id: string;
  product_name: string;
  exposure_date: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms_description: string;
  journal_ingredients?: {
    ingredient_name: string;
  }[];
}

export async function generateDoctorReportPDF(
  patientEmail: string,
  entries: JournalEntry[]
): Promise<Blob> {
  const blob = await pdf(
    <DoctorReportPDF
      patientEmail={patientEmail}
      entries={entries}
      generatedDate={new Date().toISOString()}
    />
  ).toBlob();

  return blob;
}

export function downloadPDF(blob: Blob, filename: string = 'geneguide-doctor-report.pdf') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}