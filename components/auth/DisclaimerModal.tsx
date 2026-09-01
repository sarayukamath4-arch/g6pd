"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle, CheckCircle } from "lucide-react";

export function DisclaimerModal() {
  const { user } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleAccept = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update the profile with disclaimer acceptance
      const { error } = await supabase
        .from('profiles')
        .update({ disclaimer_accepted_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      
      setAccepted(true);
      // Redirect will happen via useEffect or router
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error accepting disclaimer:', error);
    } finally {
      setLoading(false);
    }
  };

  if (accepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to GeneGuide</h2>
            <p className="text-slate-600">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Important Medical Disclaimer</CardTitle>
              <CardDescription>Please read and accept before continuing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Not Medical Advice</h3>
                <p className="text-sm text-amber-800">
                  GeneGuide provides educational information about genetic conditions and substances, 
                  based on available clinical evidence. This information is for educational purposes 
                  only and is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Key Points to Understand:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-slate-700">
                  <strong>Evidence vs. Personal Experience:</strong> GeneGuide separates established 
                  clinical evidence from your personal observations. A reaction you experience does not 
                  prove causation.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-slate-700">
                  <strong>Consult Healthcare Providers:</strong> Always seek the advice of your physician 
                  or other qualified health provider with any questions you may have regarding a medical 
                  condition or treatment.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-slate-700">
                  <strong>Individual Variation:</strong> Genetic conditions affect individuals differently. 
                  What applies to others may not apply to you.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-600 text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-slate-700">
                  <strong>Data Privacy:</strong> Your personal health observations are stored securely and 
                  are never shared with third parties.
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-slate-100 rounded-lg p-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              By clicking "I Accept", you acknowledge that you have read, understood, and agree to this 
              disclaimer. You understand that GeneGuide is an educational tool and not a replacement for 
              professional medical care.
            </p>
          </div>

          <Button 
            onClick={handleAccept} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "I Accept - Continue to GeneGuide"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}