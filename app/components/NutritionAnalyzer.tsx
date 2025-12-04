"use client";

import { useState } from "react";
import { analyzeFoodImage } from "@/app/actions";
import { saveMealToDatabase } from "@/app/saveMeal";
import { Upload, Loader2, CheckCircle, AlertCircle, Camera, Flame, Pizza } from "lucide-react";
import imageCompression from 'browser-image-compression';

interface FoodItem {
  name: string;
  portion_size: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

interface AnalysisResult {
  foods: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
  meal_type: string;
  health_tip: string;
}

export default function NutritionAnalyzer() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // ✅ Compress image before upload
      const options = {
        maxSizeMB: 0.8,          // Target 800KB
        maxWidthOrHeight: 1920,  // Max dimension
        useWebWorker: true,
        fileType: 'image/jpeg',  // Always JPEG
      };

      console.log('📸 Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const compressedFile = await imageCompression(file, options);
      
      console.log('✅ Compressed size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');

      // Preview dikhao
      const objectUrl = URL.createObjectURL(compressedFile);
      setImagePreview(objectUrl);

      // FormData ready karo
      const formData = new FormData();
      formData.append("image", compressedFile);

      // AI ko bhejo
      const response = await analyzeFoodImage(formData);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Validate data structure
        if (response.data.foods && Array.isArray(response.data.foods)) {
          setResult(response.data);
        } else {
          setError("AI returned invalid data format. Please try again.");
        }
      }
    } catch (error: any) {
      console.error('❌ Error:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!result) return;
    
    setSaving(true);
    const response = await saveMealToDatabase({
      ...result,
      image_url: imagePreview || undefined,
    });
    
    if (response.error) {
      alert("❌ " + response.error);
    } else {
      alert("✅ Meal saved successfully to database!");
    }
    setSaving(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden mb-6">
        <div className="p-8 text-white">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Pizza className="w-8 h-8" />
            <h1 className="text-3xl font-bold">AI Nutrition Scanner</h1>
          </div>
          <p className="text-center text-blue-100">Snap your meal, know your macros instantly</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 text-center cursor-pointer group">
            <input 
              type="file" 
              accept="image/*"
              capture="environment"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Camera className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-700 font-semibold text-lg block">Upload Food Photo</span>
                <span className="text-gray-500 text-sm">or click to take a picture</span>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-6 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
              <img 
                src={imagePreview} 
                alt="Food Preview" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-8 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <div className="text-center">
                <p className="text-blue-600 font-semibold text-lg">Analyzing your meal...</p>
                <p className="text-gray-500 text-sm">AI is detecting foods and calculating nutrition</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && !loading && result.foods && result.foods.length > 0 && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Meal Type Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                  <Flame className="w-4 h-4" />
                  <span className="font-semibold capitalize">{result.meal_type || "Meal"}</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800">{result.total_calories || 0}</p>
                  <p className="text-sm text-gray-500">Total Calories</p>
                </div>
              </div>

              {/* Total Macros */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl text-center border border-red-200">
                  <p className="text-2xl font-bold text-red-700">{result.total_protein || 0}g</p>
                  <p className="text-xs text-red-600 uppercase tracking-wide font-semibold mt-1">Protein</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center border border-orange-200">
                  <p className="text-2xl font-bold text-orange-700">{result.total_carbs || 0}g</p>
                  <p className="text-xs text-orange-600 uppercase tracking-wide font-semibold mt-1">Carbs</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl text-center border border-yellow-200">
                  <p className="text-2xl font-bold text-yellow-700">{result.total_fats || 0}g</p>
                  <p className="text-xs text-yellow-600 uppercase tracking-wide font-semibold mt-1">Fats</p>
                </div>
              </div>

              {/* Individual Foods */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Detected Foods ({result.foods.length})</span>
                </h3>
                
                {result.foods.map((food, index) => (
                  <div 
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 capitalize">{food.name || "Unknown Food"}</h4>
                        <p className="text-sm text-gray-600">{food.portion_size || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{food.calories || 0} cal</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          food.confidence === 'High' ? 'bg-green-100 text-green-700' :
                          food.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {food.confidence || "Low"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-3 text-sm text-gray-600">
                      <span>P: {food.protein || 0}g</span>
                      <span>C: {food.carbs || 0}g</span>
                      <span>F: {food.fats || 0}g</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Health Tip */}
              {result.health_tip && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">💡 Health Tip: </span>
                    {result.health_tip}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <button 
                  onClick={handleSaveMeal}
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save to Log</span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setResult(null);
                    setImagePreview(null);
                    setError(null);
                  }}
                  className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Scan Another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
