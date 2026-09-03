"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Lock, Trash2, Loader2 } from "lucide-react";
import { InfoBanner } from "@/components/layout/InfoBanner";
import { createClient } from "@/lib/supabase/client";
import { generateDoctorReportPDF, downloadPDF } from "@/lib/pdfExport";

export default function Profile() {
  const { user, signOut } = useAuth();
  const supabase = createClient();
  
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  const handleGeneratePDF = async () => {
    if (!user) return;

    setGeneratingPDF(true);

    try {
      // Fetch journal entries
      const { data, error } = await supabase
        .from('journal_entries')
        .select(`
          *,
          journal_ingredients (
            ingredient_name
          )
        `)
        .eq('user_id', user.id)
        .order('exposure_date', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        alert('No journal entries to export. Please add some entries first.');
        return;
      }

      // Generate PDF
      const pdfBlob = await generateDoctorReportPDF(user.email || '', data);
      
      // Download
      const filename = `geneguide-report-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadPDF(pdfBlob, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data including journal entries and learning progress.'
    );

    if (!confirmed) return;

    try {
      // Delete journal entries
      await supabase
        .from('journal_entries')
        .delete()
        .eq('user_id', user.id);

      // Delete learning progress
      await supabase
        .from('user_learning_progress')
        .delete()
        .eq('user_id', user.id);

      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      alert('Your data has been deleted. You will be signed out now.');
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again or contact support.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="ACCOUNT SETTINGS"
        title="Profile"
        subtitle="Manage your account and data"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email</p>
                  <p className="font-medium text-slate-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Account Status</p>
                  <p className="font-medium text-emerald-600">Active</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Disclaimer Accepted</p>
                  <p className="font-medium text-slate-900">Yes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Export</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Export your journal entries and observations as a PDF report for your healthcare provider.
                </p>
                <Button
                  onClick={handleGeneratePDF}
                  disabled={generatingPDF}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download Doctor Report (PDF)
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">PIN Lock</p>
                      <p className="text-xs text-slate-500">Add extra security</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" disabled>
                    Enable
                  </Button>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      PIN lock functionality coming in future update
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Permanently delete your account and all associated data.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <InfoBanner type="info" title="Privacy Notice">
        Your personal health observations are stored securely and are never shared with third parties. 
        You can export your data at any time or delete your account permanently.
      </InfoBanner>
    </div>
  );
}