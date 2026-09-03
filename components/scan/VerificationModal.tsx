"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Plus, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    product_name: string;
    ingredients: string[];
  };
  onConfirm: (data: { productName: string; ingredients: string[] }) => void;
}

export function VerificationModal({ isOpen, onClose, productData, onConfirm }: VerificationModalProps) {
  const [productName, setProductName] = useState(productData.product_name);
  const [exposureDate, setExposureDate] = useState(new Date().toISOString().split('T')[0]);
  const [ingredients, setIngredients] = useState<string[]>(productData.ingredients);
  const [newIngredient, setNewIngredient] = useState("");
  const [knownTriggers, setKnownTriggers] = useState<string[]>([]);
  const supabase = createClient();

  // Check for known G6PD triggers
  const checkKnownTriggers = async (ingredientList: string[]) => {
    try {
      const { data } = await supabase
        .from('substances')
        .select('canonical_name')
        .in('canonical_name', ingredientList);
      
      if (data) {
        setKnownTriggers(data.map(s => s.canonical_name));
      }
    } catch (error) {
      console.error('Error checking triggers:', error);
    }
  };

  // Check triggers when modal opens or ingredients change
  useEffect(() => {
    if (isOpen && ingredients.length > 0) {
      checkKnownTriggers(ingredients);
    }
  }, [isOpen, ingredients]);

  const removeIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const handleConfirm = () => {
    onConfirm({
      productName,
      ingredients
    });
    onClose();
  };

  const isKnownTrigger = (ingredient: string) => knownTriggers.includes(ingredient);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Extracted Ingredients</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          {/* Exposure Date */}
          <div className="space-y-2">
            <Label htmlFor="exposureDate">Date of Exposure</Label>
            <Input
              id="exposureDate"
              type="date"
              value={exposureDate}
              onChange={(e) => setExposureDate(e.target.value)}
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Extracted Ingredients</Label>
              <span className="text-sm text-slate-500">{ingredients.length} ingredients</span>
            </div>

            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg group"
                >
                  <span className="flex-1 font-medium text-slate-900">{ingredient}</span>
                  {isKnownTrigger(ingredient) && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-900 border-amber-300">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Known trigger
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(index)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Custom Ingredient */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom ingredient..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
              />
              <Button type="button" onClick={addIngredient} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Review before continuing</p>
                <p className="text-sm text-amber-800">
                  Scanned ingredients must be checked by the user before GeneGuide analyses them. 
                  Remove incorrect ingredients and add any that were missed.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              <Check className="w-4 h-4 mr-2" />
              Confirm & Continue to Journal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}