import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 12,
    backgroundColor: '#f0fdf4',
    padding: 8,
  },
  patientInfo: {
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 120,
    color: '#374151',
  },
  infoValue: {
    color: '#6b7280',
  },
  entry: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    border: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  entryDate: {
    fontSize: 11,
    color: '#6b7280',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  severityMild: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  severityModerate: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  severitySevere: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  ingredients: {
    marginTop: 10,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
  },
  ingredientTag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 10,
  },
  disclaimer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fef3c7',
    border: 1,
    borderColor: '#f59e0b',
    borderRadius: 8,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#78350f',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

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

interface DoctorReportProps {
  patientEmail: string;
  entries: JournalEntry[];
  generatedDate: string;
}

export function DoctorReportPDF({ patientEmail, entries, generatedDate }: DoctorReportProps) {
  const severityClass = (severity: string) => {
    switch (severity) {
      case 'Mild': return styles.severityMild;
      case 'Moderate': return styles.severityModerate;
      case 'Severe': return styles.severitySevere;
      default: return styles.severityMild;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GeneGuide - Personal Health Report</Text>
          <Text style={styles.subtitle}>G6PD Deficiency Reaction Journal</Text>
        </View>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.patientInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{patientEmail}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Report Date:</Text>
              <Text style={styles.infoValue}>{new Date(generatedDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Entries:</Text>
              <Text style={styles.infoValue}>{entries.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date Range:</Text>
              <Text style={styles.infoValue}>
                {entries.length > 0 
                  ? `${new Date(entries[entries.length - 1].exposure_date).toLocaleDateString()} - ${new Date(entries[0].exposure_date).toLocaleDateString()}`
                  : 'N/A'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Journal Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reaction Journal Entries</Text>
          {entries.map((entry, index) => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.product_name}</Text>
                <Text style={styles.entryDate}>{new Date(entry.exposure_date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.entryHeader}>
                <View style={[styles.severityBadge, severityClass(entry.severity)]}>
                  <Text>{entry.severity}</Text>
                </View>
              </View>
              {entry.symptoms_description && (
                <Text style={{ marginBottom: 10, color: '#4b5563' }}>
                  <Text style={{ fontWeight: 'bold' }}>Symptoms: </Text>
                  {entry.symptoms_description}
                </Text>
              )}
              {entry.journal_ingredients && entry.journal_ingredients.length > 0 && (
                <View style={styles.ingredients}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 6, color: '#374151' }}>
                    Ingredients ({entry.journal_ingredients.length}):
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {entry.journal_ingredients.map((ing, idx) => (
                      <View key={idx} style={styles.ingredientTag}>
                        <Text>{ing.ingredient_name}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Important Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>⚠️ IMPORTANT MEDICAL DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>
            This report contains personal observations recorded by the patient using the GeneGuide application.
            The information provided is for informational purposes only and does not constitute medical advice.
          </Text>
          <Text style={[styles.disclaimerText, { marginTop: 8 }]}>
            Correlation does not imply causation. The presence of an ingredient in multiple entries does not prove
            that it caused the reported reactions. Individual responses to substances vary significantly.
          </Text>
          <Text style={[styles.disclaimerText, { marginTop: 8 }]}>
            This data should be reviewed by a qualified healthcare provider who can interpret the information
            in the context of the patient's complete medical history and clinical examination.
          </Text>
          <Text style={[styles.disclaimerText, { marginTop: 8 }]}>
            GeneGuide is not a medical device and has not been evaluated by regulatory authorities for diagnostic
            or therapeutic purposes.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by GeneGuide - Personal Health Intelligence Platform</Text>
          <Text>For G6PD Deficiency Management</Text>
          <Text>This report is confidential and intended for the patient's healthcare provider only.</Text>
        </View>
      </Page>
    </Document>
  );
}