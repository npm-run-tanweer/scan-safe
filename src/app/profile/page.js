"use client";
import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  X,
  Plus,
  User,
  AlertTriangle,
  Heart,
  Leaf,
  Shield,
  Scan,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const commonAllergies = [
  "Peanuts",
  "Tree nuts",
  "Milk/Dairy",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Sesame",
  "Sulfites",
];

export default function UserProfile({ initialProfile }) {
  const user = useUser();
  const [profile, setProfile] = useState({
    name: initialProfile?.name || "",
    age: initialProfile?.age || 0,
    region: initialProfile?.region || "",
    allergies: initialProfile?.allergies || [],
    conditions: initialProfile?.conditions || [],
    dietaryPreference: initialProfile?.dietaryPreference || "non-vegan",
    allergyLevel: initialProfile?.allergyLevel || "moderate",
  });

  const [customAllergy, setCustomAllergy] = useState("");
  const router = useRouter();
  const setAllergyChecked = useCallback((allergy, checked) => {
    setProfile((prev) => ({
      ...prev,
      allergies: checked
        ? prev.allergies.includes(allergy)
          ? prev.allergies
          : [...prev.allergies, allergy]
        : prev.allergies.filter((a) => a !== allergy),
    }));
  }, []);

  const setConditionChecked = useCallback((condition, checked) => {
    setProfile((prev) => {
      if (condition === "None") {
        return {
          ...prev,
          conditions: checked ? ["None"] : [],
        };
      }
      const withoutNone = prev.conditions.filter((c) => c !== "None");
      const exists = withoutNone.includes(condition);
      return {
        ...prev,
        conditions: checked
          ? exists
            ? withoutNone
            : [...withoutNone, condition]
          : withoutNone.filter((c) => c !== condition),
      };
    });
  }, []);

  const addCustomAllergy = useCallback(() => {
    const val = customAllergy.trim();
    if (val && !profile.allergies.includes(val)) {
      setProfile((prev) => ({
        ...prev,
        allergies: [...prev.allergies, val],
      }));
      setCustomAllergy("");
    }
  }, [customAllergy, profile.allergies]);

  const removeAllergy = useCallback((allergy) => {
    setProfile((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please sign in first");
    // if (profile.name && profile.age > 0) onSave(profile);

    const payload = {
      clerkId: user.user.id,
      name: profile.name,
      age: Number(profile.age),
      region: profile.region,

      allergens: profile.allergies,
      conditions: profile.conditions,
      isVegan: profile.dietaryPreference === "vegan",
      allergyLevel: profile.allergyLevel,
    };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("User saved");
      setProfile({
        name: "",
        age: "",
        region: "",
        allergies: [],
        conditions: [],
        isVegan: false,
        allergyLevel: "",
      });
      router.push(`/scan`);
    } else {
      alert("User not saved");
      console.log(e);
    }
  };
  const getSeverityColor = useCallback((severity) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-700 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "severe":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }, []);

  const medicalConditions = [
    {
      name: "Diabetes",
      description:
        "A condition where the body struggles to regulate blood sugar.",
      restrictedFoods: [
        "Sugary drinks",
        "White bread",
        "Pastries",
        "Candy",
        "Processed snacks",
      ],
    },
    {
      name: "Celiac Disease",
      description: "An autoimmune reaction to eating gluten.",
      restrictedFoods: ["Wheat", "Barley", "Rye", "Pasta", "Bread with gluten"],
    },
    {
      name: "Lactose Intolerance",
      description: "The body cannot properly digest lactose found in dairy.",
      restrictedFoods: ["Milk", "Cheese", "Butter", "Cream", "Ice cream"],
    },
    {
      name: "Anemia",
      description: "A condition where the body lacks healthy red blood cells.",
      restrictedFoods: [
        "Tea",
        "Coffee",
        "Excess dairy",
        "High-calcium foods with iron meals",
      ],
    },
    {
      name: "High Blood Pressure",
      description: "Also called hypertension, where blood pressure stays high.",
      restrictedFoods: [
        "Salty foods",
        "Pickles",
        "Chips",
        "Processed meats",
        "Canned soups",
      ],
    },
    {
      name: "Heart Disease",
      description: "A condition affecting the heart and blood vessels.",
      restrictedFoods: [
        "Fried foods",
        "Trans fats",
        "Processed meats",
        "Sugary drinks",
      ],
    },
    {
      name: "Kidney Disease",
      description: "A condition where kidneys cannot filter waste properly.",
      restrictedFoods: [
        "High-sodium foods",
        "Bananas",
        "Oranges",
        "Dairy",
        "Red meat",
        "Beans",
      ],
    },
    {
      name: "None",
      description: "No medical conditions affecting diet.",
      restrictedFoods: [],
    },
  ];

  return (
    <div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-start space-y-4 py-8 bg-linear-to-r from-emerald-400 to-emerald-600 text-white rounded-t-3xl">
          <div>
            <CardTitle className="text-3xl text-white font-bold">
              Let's Create Your Safety Profile {user.isSignedIn && user.isLoaded && user.user.firstName}
            </CardTitle>
            <p className="text-gray-200 text-lg mt-2">
              Personalize your food safety experience
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Basic Information
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    className="mt-2 bg-white/80 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-slate-700 font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={profile.age === 0 ? "" : profile.age}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          age: e.target.value
                            ? parseInt(e.target.value, 10)
                            : 0,
                        }))
                      }
                      placeholder="Age"
                      className="mt-2 bg-white/80 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="region"
                      className="text-slate-700 font-medium"
                    >
                      Region
                    </Label>
                    <Input
                      id="region"
                      value={profile.region}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          region: e.target.value,
                        }))
                      }
                      placeholder="e.g., USA, India"
                      className="mt-2 bg-white/80 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Allergies Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <AlertTriangle stroke="red" className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Food Allergies
                </h3>
              </div>

              <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                Select all allergens that affect you. This helps us identify
                unsafe products.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {commonAllergies.map((allergy) => {
                  const isSelected = profile.allergies.includes(allergy);
                  return (
                    <div
                      key={allergy}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? "bg-red-50 border-red-300 text-red-500 shadow-sm"
                          : "bg-white border-slate-200 hover:border-red-200"
                      }`}
                    >
                      <Checkbox
                        id={`allergy-${allergy}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          setAllergyChecked(allergy, Boolean(checked))
                        }
                        className="border-2"
                      />
                      <Label
                        htmlFor={`allergy-${allergy}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {allergy}
                      </Label>
                    </div>
                  );
                })}
              </div>

              {/* Custom allergy input */}
              <div className="flex gap-3">
                <Input
                  placeholder="Add custom allergy"
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addCustomAllergy())
                  }
                  className="bg-white/80 border-slate-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
                <Button
                  type="button"
                  onClick={addCustomAllergy}
                  variant="outline"
                  className="px-4 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Selected allergies */}
              {profile.allergies.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700">
                    Your Allergies:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-colors"
                      >
                        {allergy}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAllergy(allergy);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Medical Conditions Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8  bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Medical Conditions
                </h3>
              </div>

              <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                Select health conditions that require specific dietary
                restrictions.
              </p>

              <div className="space-y-3">
                {medicalConditions.map((condition) => {
                  const isSelected = profile.conditions.includes(
                    condition.name
                  );

                  return (
                    <div
                      key={condition.name}
                      className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 shadow-sm"
                          : "bg-white border-slate-200 hover:border-blue-200"
                      }`}
                      onClick={() =>
                        setConditionChecked(condition.name, !isSelected)
                      }
                    >
                      <h3 className="text-base font-semibold text-gray-900">
                        {condition.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {condition.description}
                      </p>
                      {condition.restrictedFoods?.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Restricts:</span>{" "}
                          {condition.restrictedFoods.join(", ")}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dietary Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Dietary Preferences
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-700 font-medium">
                    Diet Type
                  </Label>
                  <Select
                    value={profile.dietaryPreference}
                    onValueChange={(value) =>
                      setProfile((prev) => ({
                        ...prev,
                        dietaryPreference: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2 bg-white/80 border-slate-200 focus:border-emerald-400 w-full">
                      <SelectValue placeholder="Select diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non-vegan">Non-Vegan</SelectItem>
                      <SelectItem value="vegan">🌱 Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-700 font-medium">
                    Allergy Severity
                  </Label>
                  <Select
                    value={profile.allergyLevel}
                    onValueChange={(value) =>
                      setProfile((prev) => ({
                        ...prev,
                        allergyLevel: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-2 bg-white/80 border-slate-200 focus:border-emerald-400 w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">😌 Mild</SelectItem>
                      <SelectItem value="moderate">😐 Moderate</SelectItem>
                      <SelectItem value="severe">😰 Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {profile.allergyLevel && (
                <div
                  className={`p-3 rounded-lg border ${getSeverityColor(
                    profile.allergyLevel
                  )}`}
                >
                  <p className="text-sm font-medium">
                    {profile.allergyLevel === "mild" &&
                      "Mild reactions - We'll warn you about potential allergens"}
                    {profile.allergyLevel === "moderate" &&
                      "Moderate reactions - We'll be more cautious with warnings"}
                    {profile.allergyLevel === "severe" &&
                      "Severe reactions - We'll flag any potential risk immediately"}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold py-4 text-lg shadow-card hover:shadow-floating transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {initialProfile
                ? "✨ Update Profile"
                : "🚀 Save Profile & Start Scanning"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
