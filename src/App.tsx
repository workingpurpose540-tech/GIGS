import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  Copy,
  RotateCcw,
  Utensils,
  Clock,
  Leaf,
  ChevronDown,
  CheckCircle2,
  X,
  Sparkles,
  DollarSign,
  Menu,
  Activity,
  Sun,
  Moon,
  ChefHat,
  Flame,
  Dumbbell,
  ShieldCheck,
  ShoppingBag,
  HeartHandshake,
  AlertCircle,
  Search,
  Globe,
  SlidersHorizontal,
  Compass,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Reveal } from './Reveal';
import {
  generateRecipeFromImage,
  formatUserFriendlyError,
  GeneratedRecipe
} from './services/gemini';
import { WORLD_CUISINES, CUISINE_REGIONS } from './data/cuisines';

interface PresetRecipe {
  id: string;
  name: string;
  detectedIngredients: string[];
  diet: string;
  cuisine: string;
  time: string;
  calories: string;
  protein: string;
  title: string;
  description: string;
  nutritionProfile: {
    carbs: number;
    protein: number;
    fiber: number;
    fat: number;
    netCarbs: number;
    summary: string;
  };
  ingredientsList: { item: string; amount: string }[];
  steps: string[];
  plainEnglishTip: string;
}

const PRESETS: PresetRecipe[] = [
  {
    id: 'tofu-greens',
    name: 'Tofu, Spinach & Roma Tomato',
    detectedIngredients: ['Firm Tofu', 'Fresh Spinach', 'Roma Tomato', 'Garlic Cloves'],
    diet: 'High Protein',
    cuisine: 'Asian Stir-fry',
    time: '15 mins',
    calories: '320 kcal',
    protein: '26g',
    title: 'Crispy Garlic Tofu with Wilted Spinach',
    description: 'Golden-seared tofu cubes tossed with sweet ripe tomatoes and garlic-infused tender spinach.',
    nutritionProfile: {
      carbs: 14,
      protein: 26,
      fiber: 7,
      fat: 16,
      netCarbs: 7,
      summary: 'High-protein, low-glycemic fuel. 42% of calories from quality plant protein.',
    },
    ingredientsList: [
      { item: 'Firm Tofu', amount: '200g (cut into 1-inch cubes)' },
      { item: 'Fresh Spinach', amount: '2 big handfuls, washed' },
      { item: 'Roma Tomato', amount: '1 large, roughly diced' },
      { item: 'Garlic', amount: '3 cloves, smashed and sliced' },
      { item: 'Cooking Oil', amount: '1 tablespoon' },
      { item: 'Salt & Black Pepper', amount: 'To taste' },
    ],
    steps: [
      'Pat the tofu dry with a clean paper towel. Removing surface moisture gives a golden, crunchy crust.',
      'Heat your skillet on medium-high heat with one spoon of oil. Place the tofu cubes in and let them sizzle for 3 to 4 minutes without moving them until browned, then flip to brown the other side.',
      'Toss in the sliced garlic and chopped tomatoes. Cook for 90 seconds until the tomatoes soften and release their sweet juice.',
      'Throw in the spinach. Stir gently for 60 seconds until the leaves wilt and turn bright green.',
      'Turn off the heat, sprinkle a pinch of salt and cracked black pepper, and serve warm in a bowl.',
    ],
    plainEnglishTip: 'If your tofu is wet, it steams instead of frying. Squeezing it gently in a kitchen towel for two minutes makes a night-and-day difference.',
  },
  {
    id: 'broccoli-peppers',
    name: 'Broccoli, Bell Pepper & Chickpeas',
    detectedIngredients: ['Broccoli Florets', 'Red Bell Pepper', 'Boiled Chickpeas', 'Onion'],
    diet: 'Pure Veg',
    cuisine: 'Indian',
    time: '18 mins',
    calories: '380 kcal',
    protein: '19g',
    title: 'Homestyle Spiced Chickpea & Crunchy Veggie Sauté',
    description: 'A comforting skillet toss with sweet bell peppers, tender broccoli florets, and protein-packed chickpeas.',
    nutritionProfile: {
      carbs: 48,
      protein: 19,
      fiber: 15,
      fat: 11,
      netCarbs: 33,
      summary: 'High-fiber, slow-burning complex carbs for sustained fullness and gut health.',
    },
    ingredientsList: [
      { item: 'Broccoli Florets', amount: '1 medium head, cut into bite-size pieces' },
      { item: 'Red Bell Pepper', amount: '1 bell pepper, sliced into strips' },
      { item: 'Chickpeas (boiled or canned)', amount: '1 cup, rinsed and drained' },
      { item: 'Red Onion', amount: '1 small, sliced thin' },
      { item: 'Cumin powder & Turmeric', amount: '1/2 teaspoon each' },
      { item: 'Lemon juice', amount: '1 fresh squeeze' },
    ],
    steps: [
      'Warm 1 tablespoon of oil in a wide pan on medium heat. Add the sliced onion and cook for 3 minutes until soft and translucent.',
      'Add the broccoli pieces and bell pepper strips. Stir-fry for 4 to 5 minutes so the vegetables stay pleasantly crisp.',
      'Pour in the drained chickpeas, cumin, turmeric, and 1/2 teaspoon of salt. Stir everything together so the spices coat every single bite.',
      'Cover the pan with a lid for 3 minutes on low heat to let the broccoli steam through.',
      'Uncover, squeeze fresh lemon juice over the top, and serve immediately.',
    ],
    plainEnglishTip: 'Do not throw away broccoli stems! Peel the tough outer layer with a peeler and slice the sweet inner crunch right into the pan.',
  },
  {
    id: 'mediterranean-pantry',
    name: 'Zucchini, Cherry Tomatoes & Basil',
    detectedIngredients: ['Zucchini', 'Cherry Tomatoes', 'Fresh Basil', 'Olive Oil'],
    diet: 'Low Carb',
    cuisine: 'Italian',
    time: '12 mins',
    calories: '210 kcal',
    protein: '7g',
    title: '12-Minute Blistered Tomato & Zucchini Ribbons',
    description: 'Sweet burst tomatoes that form their own silky pan-sauce over tender zucchini ribbons with fragrant hand-torn basil.',
    nutritionProfile: {
      carbs: 18,
      protein: 7,
      fiber: 6,
      fat: 14,
      netCarbs: 12,
      summary: 'Heart-healthy monounsaturated fats from olive oil paired with light, hydrating greens.',
    },
    ingredientsList: [
      { item: 'Zucchini', amount: '2 medium, sliced into thin discs' },
      { item: 'Cherry Tomatoes', amount: '1 cup whole' },
      { item: 'Fresh Basil', amount: '8 to 10 leaves, torn by hand' },
      { item: 'Garlic', amount: '2 cloves, thinly sliced' },
      { item: 'Olive Oil', amount: '1.5 tablespoons' },
      { item: 'Salt & Chili Flakes', amount: 'A light pinch' },
    ],
    steps: [
      'Get your pan hot over medium-high heat with olive oil. Drop the whole cherry tomatoes straight into the pan.',
      'Let the tomatoes sit untouched for 2 minutes until their skins blister and pop. Press a few with the back of your spoon to release their juices.',
      'Slide the zucchini and sliced garlic into the tomato juices. Cook quickly for only 3 minutes so the zucchini stays tender-crisp.',
      'Turn off the flame. Scatter the fresh torn basil and a generous pinch of salt across the warm pan.',
      'Serve warm as a light dinner or over toasted rustic bread.',
    ],
    plainEnglishTip: 'Never chop basil with a dull knife or it turns dark. Tearing the leaves gently with your fingers preserves the sweet herbal aroma.',
  },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeStep, setActiveStep] = useState<1 | 2>(1); // 1 = Upload & Ingredients, 2 = Configure & Recipe
  const [selectedPreset, setSelectedPreset] = useState<PresetRecipe>(PRESETS[0]);
  const [dietFilter, setDietFilter] = useState<string>('Pure Veg');
  const [cuisineFilter, setCuisineFilter] = useState<string>('Indian');
  const [detectedTags, setDetectedTags] = useState<string[]>(PRESETS[0].detectedIngredients);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  // Mobile & Desktop Camera State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);

  // World Cuisines State
  const [cuisineSearchTerm, setCuisineSearchTerm] = useState<string>('');
  const [selectedCuisineRegion, setSelectedCuisineRegion] = useState<string>('All');
  const [isCuisineDrawerOpen, setIsCuisineDrawerOpen] = useState<boolean>(false);
  const [customCuisineInput, setCustomCuisineInput] = useState<string>('');

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [waitlistEmail, setWaitlistEmail] = useState<string>('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0D0A08';
      document.body.style.color = '#FFF4E6';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FAF7F2';
      document.body.style.color = '#1C1612';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  const createSampleImageForPreset = (preset: PresetRecipe): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1A1412';
      ctx.fillRect(0, 0, 400, 300);

      const grad = ctx.createLinearGradient(0, 0, 400, 300);
      grad.addColorStop(0, '#261C18');
      grad.addColorStop(1, '#0F0B09');
      ctx.fillStyle = grad;
      ctx.fillRect(10, 10, 380, 280);

      ctx.fillStyle = '#FF8A3D';
      ctx.font = 'bold 20px Barlow, sans-serif';
      ctx.fillText('PlateWise Fridge Pantry', 30, 45);

      ctx.fillStyle = '#FFF4E6';
      ctx.font = '16px Barlow, sans-serif';
      ctx.fillText(`${preset.cuisine} Shelf · ${preset.diet}`, 30, 75);

      preset.detectedIngredients.forEach((ing, i) => {
        ctx.fillStyle = '#FF8A3D';
        ctx.beginPath();
        ctx.arc(45, 115 + i * 35, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#E5DDD2';
        ctx.font = 'bold 15px Barlow, sans-serif';
        ctx.fillText(ing, 65, 120 + i * 35);
      });
    }
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const applyGeneratedRecipe = (data: GeneratedRecipe) => {
    if (data.identified_ingredients && data.identified_ingredients.length > 0) {
      setDetectedTags(data.identified_ingredients);
    }

    const parsedIngredients = data.ingredients_needed.map((line) => {
      if (line.includes(':')) {
        const parts = line.split(':');
        return { item: parts[0].trim(), amount: parts.slice(1).join(':').trim() };
      }
      if (line.includes(' - ')) {
        const parts = line.split(' - ');
        return { item: parts[0].trim(), amount: parts.slice(1).join(' - ').trim() };
      }
      return { item: line, amount: 'As needed' };
    });

    const isHighProtein = dietFilter === 'High Protein';
    const isKeto = dietFilter === 'Keto';
    const isLowCarb = dietFilter === 'Low Carb';

    const newRecipe: PresetRecipe = {
      id: `ai-${Date.now()}`,
      name: data.recipe_title,
      detectedIngredients: data.identified_ingredients,
      diet: dietFilter,
      cuisine: cuisineFilter,
      time: `${data.prep_time_minutes || 25} mins`,
      calories: isKeto ? '440 kcal' : isLowCarb ? '350 kcal' : '380 kcal',
      protein: isHighProtein ? '36g' : '22g',
      title: data.recipe_title,
      description: `A delicious ${cuisineFilter.toLowerCase()} ${dietFilter.toLowerCase()} recipe crafted from ${data.identified_ingredients.slice(0, 3).join(', ')}${data.identified_ingredients.length > 3 ? ' and other pantry staples' : ''}.`,
      nutritionProfile: {
        carbs: isKeto ? 12 : isLowCarb ? 18 : 38,
        protein: isHighProtein ? 36 : 22,
        fiber: 8,
        fat: isKeto ? 28 : 14,
        netCarbs: isKeto ? 4 : isLowCarb ? 10 : 30,
        summary: `Crafted for your ${dietFilter} lifestyle. Ready in ${data.prep_time_minutes || 25} minutes.`,
      },
      ingredientsList: parsedIngredients.length > 0 ? parsedIngredients : [
        { item: 'Fresh Ingredients', amount: data.ingredients_needed.join(', ') }
      ],
      steps: data.instructions,
      plainEnglishTip: `Taste as you cook and adjust seasonings to your personal preference. Simple home cooking with no complex chef jargon.`,
    };

    setSelectedPreset(newRecipe);
  };

  const handleSelectPreset = (preset: PresetRecipe) => {
    setSelectedPreset(preset);
    setDetectedTags(preset.detectedIngredients);
    setDietFilter(preset.diet);
    setCuisineFilter(preset.cuisine);
    setUploadedImagePreview(null);
    setGenerationError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDetectedTags(detectedTags.filter((t) => t !== tagToRemove));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !detectedTags.includes(newTagInput.trim())) {
      setDetectedTags([...detectedTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const processBase64Photo = async (base64: string) => {
    setUploadedImagePreview(base64);
    setGenerationError(null);
    setIsGenerating(true);
    try {
      const recipeData = await generateRecipeFromImage(base64, dietFilter, cuisineFilter);
      applyGeneratedRecipe(recipeData);
      setGenerationError(null);
    } catch (err: any) {
      console.warn('Vision analysis note:', err);
      setGenerationError(formatUserFriendlyError(err));
      // Friendly fallback ingredients so the UI remains interactive
      setDetectedTags(['Baby Spinach', 'Vine Tomatoes', 'Red Onion', 'Button Mushrooms']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        processBase64Photo(base64);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value so selecting the same photo again fires onChange
    e.target.value = '';
  };

  // Web Audio camera shutter sound
  const playShutterSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext policy restriction fallback
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  const startLiveCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setCameraLoading(true);
    setCameraError(null);
    setCapturedPhoto(null);
    setIsCameraModalOpen(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: targetFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      setFacingMode(targetFacing);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Video playback warning:', e));
      }
    } catch (err: any) {
      console.warn('Live camera stream not directly accessible, launching native camera:', err);
      setCameraError('Opening your mobile camera directly...');
      // Seamless fallback to mobile native camera file input
      setTimeout(() => {
        setIsCameraModalOpen(false);
        cameraInputRef.current?.click();
      }, 600);
    } finally {
      setCameraLoading(false);
    }
  };

  const toggleCameraFacing = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    await startLiveCamera(nextFacing);
  };

  const handleCapturePhoto = () => {
    playShutterSound();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPhoto(dataUrl);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(console.warn);
    }
  };

  const handleConfirmCapturedPhoto = () => {
    if (capturedPhoto) {
      const photoToUse = capturedPhoto;
      stopLiveCamera();
      setIsCameraModalOpen(false);
      setCapturedPhoto(null);
      processBase64Photo(photoToUse);
    }
  };

  const handleCloseCameraModal = () => {
    stopLiveCamera();
    setIsCameraModalOpen(false);
    setCapturedPhoto(null);
    setCameraError(null);
  };

  const handleDirectMobileCamera = () => {
    // Directly launches the hardware mobile camera shutter
    cameraInputRef.current?.click();
  };

  // Sync camera stream to video element when stream or modal opens
  useEffect(() => {
    if (isCameraModalOpen && videoRef.current && cameraStream && !capturedPhoto) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => console.warn('Video auto-play failed:', err));
    }
  }, [isCameraModalOpen, cameraStream, capturedPhoto]);

  // Clean up media tracks on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleTriggerGenerate = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    try {
      let imageToUse = uploadedImagePreview;
      if (!imageToUse) {
        imageToUse = createSampleImageForPreset(selectedPreset);
      }
      const recipeData = await generateRecipeFromImage(imageToUse, dietFilter, cuisineFilter);
      applyGeneratedRecipe(recipeData);
      setGenerationError(null);
    } catch (err: any) {
      console.error('Gemini recipe generation error:', err);
      setGenerationError(formatUserFriendlyError(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomCuisine = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCuisineInput.trim()) {
      setCuisineFilter(customCuisineInput.trim());
      setCustomCuisineInput('');
      setIsCuisineDrawerOpen(false);
    }
  };

  const handleCopyRecipe = () => {
    const recipeText = `${selectedPreset.title}\n\nTime: ${selectedPreset.time} | Diet: ${dietFilter} | Cuisine: ${cuisineFilter}\n\nIngredients:\n${selectedPreset.ingredientsList.map((i) => `• ${i.item}: ${i.amount}`).join('\n')}\n\nSteps:\n${selectedPreset.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}\n\nTip in Plain English:\n${selectedPreset.plainEnglishTip}`;
    navigator.clipboard.writeText(recipeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim()) {
      setWaitlistSubmitted(true);
      setWaitlistEmail('');
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredWorldCuisines = WORLD_CUISINES.filter((item) => {
    const matchesRegion =
      selectedCuisineRegion === 'All'
        ? true
        : selectedCuisineRegion === 'Popular'
        ? item.popular
        : item.region === selectedCuisineRegion;

    const matchesSearch =
      cuisineSearchTerm.trim() === ''
        ? true
        : item.name.toLowerCase().includes(cuisineSearchTerm.toLowerCase()) ||
          item.flavorNotes.toLowerCase().includes(cuisineSearchTerm.toLowerCase());

    return matchesRegion && matchesSearch;
  });

  const activeCuisineDetails = WORLD_CUISINES.find(
    (c) => c.name.toLowerCase() === cuisineFilter.toLowerCase()
  ) || {
    id: 'custom',
    name: cuisineFilter,
    region: 'Global & Fusion' as const,
    flag: '🌍',
    flavorNotes: 'Authentic homestyle blend of regional seasonings',
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? 'bg-[#0D0A08] text-[#FFF4E6] selection:bg-[#FF8A3D] selection:text-[#0D0A08]'
          : 'bg-[#FAF7F2] text-[#1C1612] selection:bg-[#FF8A3D] selection:text-white'
      }`}
    >
      {/* 1. TOP BAR NAVIGATION */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
          isDark
            ? 'bg-[#0D0A08]/85 border-[#B5A595]/15 text-[#FFF4E6]'
            : 'bg-[#FAF7F2]/88 border-[#E5DDD2] text-[#1C1612]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark with Soft Rounded Icon */}
          <a
            href="/"
            className={`text-2xl font-black tracking-tight flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[#FF8A3D] ${
              isDark ? 'text-[#FFF4E6] headline-glow-sm' : 'text-[#1C1612]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF8A3D] to-[#ffaa6d] flex items-center justify-center text-[#0D0A08] shadow-[0_4px_16px_rgba(255,138,61,0.4)]">
              <ChefHat className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span>PlateWise-AI</span>
          </a>

          {/* Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-8 text-sm font-semibold tracking-tight ${
              isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'
            }`}
          >
            <button
              onClick={() => scrollToSection('upload-studio')}
              className="transition-all hover:text-[#FF8A3D]"
            >
              Upload Photo
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="transition-all hover:text-[#FF8A3D]"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className="transition-all hover:text-[#FF8A3D]"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="transition-all hover:text-[#FF8A3D]"
            >
              FAQ
            </button>
          </nav>

          {/* Action Bar: Glassmorphic Theme Switcher & Primary Action Button */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Theme Toggle Glass Button */}
            <button
              onClick={toggleTheme}
              className={`h-11 px-4 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle dark and light theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-[#FF8A3D]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#FF8A3D]" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                scrollToSection('upload-studio');
                setActiveStep(1);
              }}
              className="h-11 px-6 rounded-xl glass-btn-primary text-[#0D0A08] text-xs uppercase tracking-wider font-extrabold whitespace-nowrap active:scale-[0.98]"
            >
              Upload Photo
            </button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl transition-all ${
                isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-[#FF8A3D]" /> : <Moon className="w-5 h-5 text-[#FF8A3D]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-all ${
                isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF8A3D]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden border-b px-6 py-6 flex flex-col gap-3 backdrop-blur-2xl ${
              isDark ? 'border-[#B5A595]/20 bg-[#0D0A08]/95' : 'border-[#E5DDD2] bg-[#FAF7F2]/95'
            }`}
          >
            <button
              onClick={() => scrollToSection('upload-studio')}
              className={`text-left font-bold text-base py-2.5 border-b ${
                isDark ? 'border-[#171210] text-[#FFF4E6]' : 'border-[#E5DDD2] text-[#1C1612]'
              }`}
            >
              Upload Photo
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`text-left font-bold text-base py-2.5 border-b ${
                isDark ? 'border-[#171210] text-[#FFF4E6]' : 'border-[#E5DDD2] text-[#1C1612]'
              }`}
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className={`text-left font-bold text-base py-2.5 border-b ${
                isDark ? 'border-[#171210] text-[#FFF4E6]' : 'border-[#E5DDD2] text-[#1C1612]'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`text-left font-bold text-base py-2.5 border-b ${
                isDark ? 'border-[#171210] text-[#FFF4E6]' : 'border-[#E5DDD2] text-[#1C1612]'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => {
                scrollToSection('upload-studio');
                setActiveStep(1);
              }}
              className="mt-3 w-full py-3.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs uppercase tracking-wider font-extrabold text-center shadow-lg"
            >
              Upload Photo Now
            </button>
          </div>
        )}
      </header>

      {/* 1. STARTING TAGLINE HERO SECTION */}
      <section
        className={`py-14 sm:py-20 border-b transition-colors relative overflow-hidden ${
          isDark ? 'bg-[#0D0A08] border-[#B5A595]/15' : 'bg-[#FAF7F2] border-[#E5DDD2]'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-[#FF8A3D]/[0.08] blur-[140px] pointer-events-none rounded-full"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal variant="stat" delay={40} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#FF8A3D] font-bold mb-6 border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 shadow-[0_0_15px_rgba(255,138,61,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free · No Subscription Needed</span>
          </Reveal>

          <Reveal variant="heading" delay={80}>
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-4 ${
                isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
              }`}
            >
              Fresh from your fridge, <br className="hidden sm:inline" />
              <span className="text-[#FF8A3D]">not a database</span>
            </h1>
          </Reveal>

          <Reveal variant="heading" delay={140}>
            <p
              className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-4 ${
                isDark ? 'text-[#FFF4E6]/90 headline-glow-sm' : 'text-[#1C1612]/90'
              }`}
            >
              Dinner decided by what you already have
            </p>
          </Reveal>

          <Reveal variant="heading" delay={200}>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              Snap a photo of your fridge. We plan your week and write the grocery list.
            </p>
          </Reveal>

          <Reveal variant="card" delay={260} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                scrollToSection('upload-studio');
                setActiveStep(1);
              }}
              className="px-8 py-4 rounded-xl glass-btn-primary text-[#0D0A08] text-sm uppercase tracking-wider font-extrabold flex items-center gap-2 shadow-lg active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
              <span>Snap Your Fridge Photo</span>
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${
                isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
              }`}
            >
              <Utensils className="w-4 h-4 text-[#FF8A3D]" />
              <span>How It Works</span>
            </button>
          </Reveal>
        </div>
      </section>

      {/* 2. THREE-STEP PROTOCOL (SHIFTED TO TOP) */}
      <section
        id="how-it-works"
        className={`pt-12 pb-16 border-b transition-colors relative ${
          isDark ? 'bg-[#0D0A08] border-[#B5A595]/15' : 'bg-[#FAF7F2] border-[#E5DDD2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variant="heading" className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#FF8A3D] font-bold mb-3 border border-[#FF8A3D]/25 bg-[#FF8A3D]/10">
              Three-Step Protocol
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${
                isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
              }`}
            >
              From fridge to hot pan in three clicks.
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              No grocery trips. No complicated cooking terms. Just simple, delicious home meals.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <Reveal
              variant="card"
              delay={90}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 flex items-center justify-center text-xl font-black text-[#FF8A3D] mb-4">
                  01
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-[#FFF4E6] headline-glow-sm' : 'text-[#1C1612]'
                  }`}
                >
                  Snap & Upload
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Take a photo of whatever is sitting on your counter or in your crisper drawer.
                </p>
              </div>
              <div
                className={`mt-6 pt-3 border-t text-xs font-semibold ${
                  isDark ? 'border-[#B5A595]/15 text-[#B5A595]' : 'border-[#E5DDD2] text-[#6E6259]'
                }`}
              >
                Takes &lt; 5 seconds
              </div>
            </Reveal>

            {/* Step 2 */}
            <Reveal
              variant="card"
              delay={180}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 flex items-center justify-center text-xl font-black text-[#FF8A3D] mb-4">
                  02
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-[#FFF4E6] headline-glow-sm' : 'text-[#1C1612]'
                  }`}
                >
                  Dial In Preferences
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Select Pure Veg, High Protein, or Low Carb and pick your favorite cuisine.
                </p>
              </div>
              <div
                className={`mt-6 pt-3 border-t text-xs font-semibold ${
                  isDark ? 'border-[#B5A595]/15 text-[#B5A595]' : 'border-[#E5DDD2] text-[#6E6259]'
                }`}
              >
                1-tap selection
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal
              variant="card"
              delay={270}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D]/15 border border-[#FF8A3D]/30 flex items-center justify-center text-xl font-black text-[#FF8A3D] mb-4">
                  03
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? 'text-[#FFF4E6] headline-glow-sm' : 'text-[#1C1612]'
                  }`}
                >
                  Cook in Plain English
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Follow conversational step-by-step directions. Enjoy a hot meal in under 20 mins.
                </p>
              </div>
              <div
                className={`mt-6 pt-3 border-t text-xs font-semibold ${
                  isDark ? 'border-[#B5A595]/15 text-[#B5A595]' : 'border-[#E5DDD2] text-[#6E6259]'
                }`}
              >
                15 - 20 mins cooking time
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. UPLOAD PHOTO & RECIPE STUDIO (SHIFTED TO TOP) */}
      <section
        id="upload-studio"
        className={`py-16 md:py-24 border-b transition-colors relative ${
          isDark ? 'bg-[#0D0A08] border-[#B5A595]/15' : 'bg-[#FAF7F2] border-[#E5DDD2]'
        }`}
      >
        {/* Soft background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#FF8A3D]/[0.07] blur-[150px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <Reveal variant="heading" className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#FF8A3D] font-bold mb-3 border border-[#FF8A3D]/25 bg-[#FF8A3D]/10">
              Interactive Cooking Studio
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 ${
                isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
              }`}
            >
              Upload Your Product & Generate
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              Drop a photo of your fridge ingredients below or tap a sample pantry shelf to get started.
            </p>
          </Reveal>

          {/* Stepper Navigation */}
          <Reveal variant="stat" delay={90} className="max-w-md mx-auto mb-8">
            <div
              className={`p-1.5 rounded-2xl border flex items-center justify-between ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <button
                onClick={() => setActiveStep(1)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeStep === 1
                    ? 'glass-btn-primary text-[#0D0A08]'
                    : isDark
                    ? 'text-[#B5A595] hover:text-[#FFF4E6]'
                    : 'text-[#6E6259] hover:text-[#1C1612]'
                }`}
              >
                <span>1. Ingredients</span>
              </button>
              <button
                onClick={() => setActiveStep(2)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeStep === 2
                    ? 'glass-btn-primary text-[#0D0A08]'
                    : isDark
                    ? 'text-[#B5A595] hover:text-[#FFF4E6]'
                    : 'text-[#6E6259] hover:text-[#1C1612]'
                }`}
              >
                <span>2. Customize & Recipe</span>
              </button>
            </div>
          </Reveal>

          {/* Main Glassmorphic Container for Demo Studio */}
          <div
            className={`max-w-5xl mx-auto rounded-3xl p-6 sm:p-10 border transition-all ${
              isDark ? 'glass-section-dark' : 'glass-section-light'
            }`}
          >
            {/* Hidden File and Camera Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* STEP 1: INGREDIENTS & UPLOAD */}
            {activeStep === 1 && (
              <div>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className={`text-2xl font-black ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                      Step 1: Upload or Choose Ingredients
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                      Directly click a photo of your fridge ingredients on mobile or pick a sample pantry shelf.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FF8A3D] px-3 py-1 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/30">
                      Step 1 of 2
                    </span>
                  </div>
                </div>

                {/* Mobile Camera & Photo Quick-Action Cards */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Camera Option: Instant Mobile & Webcam Capture */}
                  <button
                    type="button"
                    onClick={() => startLiveCamera('environment')}
                    className={`group relative p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                      isDark
                        ? 'border-[#FF8A3D]/80 bg-gradient-to-br from-[#FF8A3D]/15 via-[#FF8A3D]/5 to-black/40 shadow-[0_0_25px_rgba(255,138,61,0.15)] hover:border-[#FF8A3D]'
                        : 'border-[#FF8A3D] bg-gradient-to-br from-[#FF8A3D]/10 via-white to-amber-50/50 shadow-md hover:border-[#FF8A3D]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D] text-[#0D0A08] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                        <Camera className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Take Photo with Camera
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF8A3D] text-[#0D0A08]">
                            Mobile
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                          Click photos directly with your phone camera or webcam
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#FF8A3D]/20 text-[#FF8A3D] group-hover:bg-[#FF8A3D] group-hover:text-[#0D0A08] transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Upload Option: Pick from Gallery/Files */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative p-4 sm:p-5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                      isDark
                        ? 'border-[#B5A595]/20 bg-black/40 hover:border-[#FF8A3D]/50 hover:bg-white/[0.03]'
                        : 'border-[#E5DDD2] bg-white/70 hover:border-[#FF8A3D]/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0 ${
                        isDark ? 'bg-white/5 border-white/10 text-[#FF8A3D]' : 'bg-neutral-100 border-[#E5DDD2] text-[#FF8A3D]'
                      }`}>
                        <Upload className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Upload from Gallery
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isDark ? 'border-white/10 text-[#B5A595]' : 'border-neutral-200 text-[#6E6259]'
                          }`}>
                            Photos / Files
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                          Pick an existing fridge photo from your device storage
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-[#B5A595] group-hover:text-[#FF8A3D]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>

                {/* Sample Pantry Shelves */}
                <div className="mb-8">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                      isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'
                    }`}
                  >
                    Or Quick Test with a Sample Pantry Shelf
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PRESETS.map((preset, pIdx) => {
                      const isSelected = selectedPreset.id === preset.id;
                      return (
                        <Reveal key={preset.id} variant="card" delay={pIdx * 90}>
                          <button
                            onClick={() => handleSelectPreset(preset)}
                            className={`w-full h-full p-4 rounded-2xl text-left border transition-all ${
                              isSelected
                                ? isDark
                                  ? 'border-2 border-[#FF8A3D] bg-[#FF8A3D]/10 shadow-[0_0_20px_rgba(255,138,61,0.25)]'
                                  : 'border-2 border-[#FF8A3D] bg-white shadow-md'
                                : isDark
                                ? 'border-[#B5A595]/20 bg-black/40 hover:border-[#FF8A3D]/40 text-[#B5A595]'
                                : 'border-[#E5DDD2] bg-white/70 hover:border-[#FF8A3D]/40 text-[#6E6259]'
                            }`}
                          >
                            <div className="text-xs text-[#FF8A3D] uppercase tracking-wider mb-1 font-semibold">
                              {preset.cuisine} · {preset.diet}
                            </div>
                            <div
                              className={`text-sm font-bold ${
                                isSelected
                                  ? isDark
                                    ? 'text-[#FFF4E6] headline-glow-sm'
                                    : 'text-[#1C1612]'
                                  : isDark
                                  ? 'text-[#B5A595]'
                                  : 'text-[#6E6259]'
                              }`}
                            >
                              {preset.name}
                            </div>
                          </button>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>

                {/* Photo Upload & Camera Dropzone */}
                <Reveal
                  variant="image"
                  delay={100}
                  className={`border-2 border-dashed rounded-3xl transition-all p-6 sm:p-10 text-center mb-8 relative ${
                    isDark
                      ? 'border-[#FF8A3D]/40 bg-black/30'
                      : 'border-[#FF8A3D]/40 bg-white/50'
                  }`}
                >
                  {uploadedImagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4 border border-[#FF8A3D] rounded-2xl p-1.5 bg-[#0D0A08] shadow-md max-w-md w-full">
                        <img
                          src={uploadedImagePreview}
                          alt="Uploaded product preview"
                          className="max-h-64 w-full rounded-xl object-contain bg-black/40"
                        />
                        <button
                          onClick={() => setUploadedImagePreview(null)}
                          className="absolute -top-3 -right-3 rounded-full bg-[#FF8A3D] text-[#0D0A08] p-1.5 hover:bg-[#ff9a57] shadow-md cursor-pointer transition-transform hover:scale-110"
                          title="Clear photo"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {isGenerating ? (
                        <div className="text-xs uppercase text-[#FF8A3D] font-bold flex items-center gap-1.5 animate-pulse mb-4">
                          <RotateCcw className="w-4 h-4 animate-spin text-[#FF8A3D]" />
                          <span>Analyzing your food...</span>
                        </div>
                      ) : (
                        <div className="text-xs uppercase text-[#FF8A3D] font-bold flex items-center gap-1.5 mb-4">
                          <CheckCircle2 className="w-4 h-4 text-[#FF8A3D]" />
                          <span>Food image analyzed successfully.</span>
                        </div>
                      )}

                      {/* Photo Replacement Quick Actions */}
                      <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => startLiveCamera('environment')}
                          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider glass-btn-primary text-[#0D0A08] flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Retake with Camera</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                            isDark
                              ? 'bg-white/5 border-[#B5A595]/20 text-[#FFF4E6] hover:bg-white/10'
                              : 'bg-neutral-100 border-[#E5DDD2] text-[#1C1612] hover:bg-white'
                          }`}
                        >
                          <Upload className="w-4 h-4 text-[#FF8A3D]" />
                          <span>Choose Different Photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUploadedImagePreview(null)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1 cursor-pointer transition-all ${
                            isDark
                              ? 'border-red-500/30 text-red-300 hover:bg-red-500/10'
                              : 'border-red-400/40 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <button
                          type="button"
                          onClick={() => startLiveCamera('environment')}
                          className="w-16 h-16 rounded-2xl bg-[#FF8A3D] text-[#0D0A08] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Open Camera"
                        >
                          <Camera className="w-8 h-8 stroke-[2.2]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                            isDark ? 'bg-black/50 border-[#B5A595]/30 text-[#FF8A3D]' : 'bg-white border-[#E5DDD2] text-[#FF8A3D]'
                          }`}
                          title="Upload Photo File"
                        >
                          <Upload className="w-6 h-6 stroke-[2]" />
                        </button>
                      </div>

                      <h3
                        className={`text-lg sm:text-xl font-bold mb-1.5 ${
                          isDark ? 'text-[#FFF4E6] headline-glow-sm' : 'text-[#1C1612]'
                        }`}
                      >
                        Snap a photo or upload your fridge ingredients
                      </h3>
                      <p className={`text-xs sm:text-sm mb-5 max-w-md ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                        Directly click a photo of your fresh vegetables, product, or pantry shelf. Our vision model isolates every ingredient automatically.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                        <button
                          type="button"
                          onClick={() => startLiveCamera('environment')}
                          className="px-5 py-2.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Click with Camera</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                            isDark
                              ? 'bg-black/40 border-[#B5A595]/20 text-[#FFF4E6] hover:bg-white/5'
                              : 'bg-white border-[#E5DDD2] text-[#1C1612] hover:bg-neutral-50'
                          }`}
                        >
                          <Upload className="w-4 h-4 text-[#FF8A3D]" />
                          <span>Browse Files</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDirectMobileCamera}
                          className="sm:hidden px-3.5 py-2 rounded-xl text-[11px] font-bold border border-[#FF8A3D]/40 text-[#FF8A3D] bg-[#FF8A3D]/10 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Direct Mobile Shutter</span>
                        </button>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/25 text-[11px] uppercase tracking-wider font-bold">
                        <span>Mobile Camera Supported</span>
                        <span>·</span>
                        <span>JPG, PNG, WEBP</span>
                      </div>
                    </div>
                  )}
                </Reveal>

                {/* Selected Ingredients Tag List */}
                <Reveal
                  variant="stat"
                  delay={140}
                  className={`p-6 rounded-2xl border mb-8 ${
                    isDark ? 'bg-black/40 border-[#B5A595]/15' : 'bg-white/60 border-[#E5DDD2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className={`text-xs font-bold uppercase tracking-tight ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                      Current Ingredients ({detectedTags.length})
                    </label>
                    <span className={`text-xs ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                      Click (×) to remove or add your own
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {detectedTags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
                          isDark
                            ? 'bg-[#171210] border-[#FF8A3D]/60 text-[#FFF4E6] shadow-[0_0_10px_rgba(255,138,61,0.2)]'
                            : 'bg-white border-[#FF8A3D]/60 text-[#1C1612] shadow-sm'
                        }`}
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className={`hover:text-[#FF8A3D] focus-visible:outline-none ${
                            isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'
                          }`}
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Tag Input */}
                  <form onSubmit={handleAddTag} className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add an ingredient (e.g., Cumin)"
                      className={`flex-1 px-4 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#FF8A3D] ${
                        isDark
                          ? 'border-[#B5A595]/30 bg-[#171210] text-[#FFF4E6] placeholder-[#B5A595]/50'
                          : 'border-[#E5DDD2] bg-white text-[#1C1612] placeholder-[#6E6259]/50'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-bold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </form>
                </Reveal>

                {/* Next Step Action */}
                <div className="flex justify-end pt-4 border-t border-[#B5A595]/15">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-8 py-3.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 active:scale-[0.98]"
                  >
                    <span>Next: Customize Preferences</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SIMPLIFIED RECIPE CONFIGURATION & BESPOKE RECIPE */}
            {activeStep === 2 && (
              <div>
                {/* Back button */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#B5A595]/15">
                  <button
                    onClick={() => setActiveStep(1)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Ingredients</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#FF8A3D] px-3 py-1 rounded-full bg-[#FF8A3D]/10 border border-[#FF8A3D]/30">
                      Step 2 of 2
                    </span>
                  </div>
                </div>

                {/* Simplified Parameter Configuration Box */}
                <Reveal
                  variant="card"
                  className={`p-6 sm:p-8 rounded-3xl border mb-8 ${
                    isDark ? 'bg-black/40 border-[#B5A595]/15' : 'bg-white/60 border-[#E5DDD2]'
                  }`}
                >
                  <div className="mb-6">
                    <h3 className={`text-2xl font-black ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                      Customize Your Recipe
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                      Choose your dietary preference and cuisine flavor in 1 click.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Dietary Requirement Pills */}
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                        Dietary Requirement
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {[
                          { name: 'Pure Veg', icon: '🌿' },
                          { name: 'High Protein', icon: '💪' },
                          { name: 'Low Carb', icon: '🥑' },
                          { name: 'Vegan', icon: '🌱' },
                          { name: 'Keto', icon: '⚡' },
                        ].map((diet) => {
                          const isActive = dietFilter === diet.name;
                          return (
                            <button
                              key={diet.name}
                              type="button"
                              onClick={() => setDietFilter(diet.name)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                                isActive
                                  ? 'glass-btn-primary text-[#0D0A08]'
                                  : isDark
                                  ? 'glass-btn-secondary-dark text-[#B5A595] hover:text-[#FFF4E6]'
                                  : 'glass-btn-secondary-light text-[#6E6259] hover:text-[#1C1612]'
                              }`}
                            >
                              <span>{diet.icon}</span>
                              <span>{diet.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cuisine Flavor Profile Pills & All World Cuisines */}
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div>
                          <label
                            className={`block text-xs font-bold uppercase tracking-wider ${
                              isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                            }`}
                          >
                            Cuisine Flavor Profile
                          </label>
                          <span className={`text-[11px] ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                            Select from quick favorites or explore all cuisines of the world (40+ countries & regions).
                          </span>
                        </div>

                        {/* Selected Cuisine Indicator Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold border bg-[#FF8A3D]/10 border-[#FF8A3D]/30 text-[#FF8A3D]">
                          <span>{activeCuisineDetails.flag}</span>
                          <span>Active: {activeCuisineDetails.name}</span>
                        </div>
                      </div>

                      {/* Active Flavor Notes Preview */}
                      {activeCuisineDetails.flavorNotes && (
                        <div
                          className={`mb-3 px-3.5 py-2 rounded-xl text-xs border flex items-center gap-2 ${
                            isDark
                              ? 'bg-black/30 border-[#B5A595]/15 text-[#B5A595]'
                              : 'bg-neutral-50 border-[#E5DDD2] text-[#6E6259]'
                          }`}
                        >
                          <span className="text-[#FF8A3D] font-bold">Profile:</span>
                          <span className="italic">{activeCuisineDetails.flavorNotes}</span>
                        </div>
                      )}

                      {/* Popular Quick Pills */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {WORLD_CUISINES.filter((c) => c.popular)
                          .slice(0, 10)
                          .map((cuisine) => {
                            const isActive =
                              cuisineFilter.toLowerCase() === cuisine.name.toLowerCase();
                            return (
                              <button
                                key={cuisine.id}
                                type="button"
                                onClick={() => setCuisineFilter(cuisine.name)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isActive
                                    ? 'glass-btn-primary text-[#0D0A08]'
                                    : isDark
                                    ? 'glass-btn-secondary-dark text-[#B5A595] hover:text-[#FFF4E6]'
                                    : 'glass-btn-secondary-light text-[#6E6259] hover:text-[#1C1612]'
                                }`}
                              >
                                <span>{cuisine.flag}</span>
                                <span>{cuisine.name}</span>
                              </button>
                            );
                          })}

                        {/* Toggle button to open All World Cuisines */}
                        <button
                          type="button"
                          onClick={() => setIsCuisineDrawerOpen(!isCuisineDrawerOpen)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCuisineDrawerOpen
                              ? 'bg-[#FF8A3D] text-[#0D0A08] border-[#FF8A3D]'
                              : 'border-[#FF8A3D]/40 text-[#FF8A3D] hover:bg-[#FF8A3D]/10'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>
                            {isCuisineDrawerOpen
                              ? 'Hide World Cuisines'
                              : 'Explore All World Cuisines (40+)'}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${
                              isCuisineDrawerOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* EXPANDED ALL WORLD CUISINES EXPLORER */}
                      {isCuisineDrawerOpen && (
                        <div
                          className={`p-4 sm:p-5 rounded-2xl border transition-all mb-4 ${
                            isDark
                              ? 'bg-black/50 border-[#FF8A3D]/30'
                              : 'bg-neutral-50/90 border-[#FF8A3D]/30'
                          }`}
                        >
                          {/* Search & Region Filters */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                            {/* Search input for cuisines */}
                            <div className="relative flex-1">
                              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#FF8A3D]" />
                              <input
                                type="text"
                                value={cuisineSearchTerm}
                                onChange={(e) => setCuisineSearchTerm(e.target.value)}
                                placeholder="Search cuisines (e.g., Peruvian, Thai, Moroccan, Greek, Polish)..."
                                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs border outline-none transition-all ${
                                  isDark
                                    ? 'bg-black/40 border-[#B5A595]/20 text-[#FFF4E6] placeholder-[#B5A595]/50 focus:border-[#FF8A3D]'
                                    : 'bg-white border-[#E5DDD2] text-[#1C1612] placeholder-[#6E6259]/60 focus:border-[#FF8A3D]'
                                }`}
                              />
                              {cuisineSearchTerm && (
                                <button
                                  type="button"
                                  onClick={() => setCuisineSearchTerm('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B5A595] hover:text-[#FF8A3D]"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>

                            {/* Region tabs */}
                            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                              {CUISINE_REGIONS.map((region) => (
                                <button
                                  key={region}
                                  type="button"
                                  onClick={() => setSelectedCuisineRegion(region)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                                    selectedCuisineRegion === region
                                      ? 'bg-[#FF8A3D] text-[#0D0A08]'
                                      : isDark
                                      ? 'bg-white/5 text-[#B5A595] hover:text-[#FFF4E6]'
                                      : 'bg-black/5 text-[#6E6259] hover:text-[#1C1612]'
                                  }`}
                                >
                                  {region}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* World Cuisines Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
                            {filteredWorldCuisines.map((cuisine) => {
                              const isSelected =
                                cuisineFilter.toLowerCase() === cuisine.name.toLowerCase();
                              return (
                                <button
                                  key={cuisine.id}
                                  type="button"
                                  onClick={() => {
                                    setCuisineFilter(cuisine.name);
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FF8A3D]/20 border-[#FF8A3D] shadow-sm'
                                      : isDark
                                      ? 'bg-black/30 border-[#B5A595]/15 hover:border-[#FF8A3D]/40 text-[#FFF4E6]'
                                      : 'bg-white border-[#E5DDD2] hover:border-[#FF8A3D]/40 text-[#1C1612]'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-1.5 mb-1">
                                    <span className="text-base">{cuisine.flag}</span>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        isSelected
                                          ? 'bg-[#FF8A3D] text-[#0D0A08]'
                                          : isDark
                                          ? 'bg-white/5 text-[#B5A595]'
                                          : 'bg-neutral-100 text-[#6E6259]'
                                      }`}
                                    >
                                      {cuisine.region.split(' ')[0]}
                                    </span>
                                  </div>
                                  <div className="font-bold text-xs truncate mb-1">
                                    {cuisine.name}
                                  </div>
                                  <div
                                    className={`text-[10px] line-clamp-1 italic ${
                                      isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'
                                    }`}
                                  >
                                    {cuisine.flavorNotes}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Cuisine Input */}
                          <form
                            onSubmit={handleAddCustomCuisine}
                            className="mt-4 pt-3 border-t border-[#B5A595]/15 flex items-center gap-2"
                          >
                            <input
                              type="text"
                              value={customCuisineInput}
                              onChange={(e) => setCustomCuisineInput(e.target.value)}
                              placeholder="Don't see your regional style? Enter any world cuisine (e.g. Kashmiri, Bavarian, Okinawan, Goan)..."
                              className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                                isDark
                                  ? 'bg-black/40 border-[#B5A595]/20 text-[#FFF4E6] placeholder-[#B5A595]/50 focus:border-[#FF8A3D]'
                                  : 'bg-white border-[#E5DDD2] text-[#1C1612] placeholder-[#6E6259]/60 focus:border-[#FF8A3D]'
                              }`}
                            />
                            <button
                              type="submit"
                              disabled={!customCuisineInput.trim()}
                              className="px-4 py-2 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-bold whitespace-nowrap disabled:opacity-50 cursor-pointer"
                            >
                              Set Cuisine
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Notification if Gemini API fails or key is missing */}
                  {generationError && (
                    <div className="mb-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs flex items-start justify-between gap-3 animate-in fade-in">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-[#FF8A3D] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-[#FF8A3D] mb-0.5">Notice</div>
                          <div className="leading-relaxed">{generationError}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGenerationError(null)}
                        className="text-[#B5A595] hover:text-[#FFF4E6] p-1 cursor-pointer transition-colors"
                        title="Dismiss notice"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Generate Button & Model Badge */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#B5A595]/15">
                    <div className="flex items-center gap-2 text-[11px] text-[#FF8A3D] font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Food Vision</span>
                    </div>

                    <button
                      onClick={handleTriggerGenerate}
                      disabled={isGenerating}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw className="w-4 h-4 animate-spin text-[#0D0A08]" />
                          <span>Cooking Your Recipe...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-[#0D0A08]" />
                          <span>Generate My Recipe</span>
                        </>
                      )}
                    </button>
                  </div>
                </Reveal>

                {/* THE BESPOKE GENERATED RECIPE OUTPUT CARD */}
                <div id="recipe-output-card">
                  <Reveal
                    variant="stat"
                    delay={90}
                    className={`rounded-3xl p-6 sm:p-8 border transition-all shadow-xl ${
                      isDark ? 'glass-card-dark' : 'glass-card-light'
                    }`}
                  >
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#B5A595]/20 mb-6">
                    <div>
                      <div
                        className={`text-xs uppercase tracking-wider mb-1 flex items-center gap-2 ${
                          isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'
                        }`}
                      >
                        <span className="text-[#FF8A3D] font-bold">PlateWise Recipe</span>
                        <span>·</span>
                        <span>{dietFilter}</span>
                        <span>·</span>
                        <span>{cuisineFilter}</span>
                      </div>
                      <h3
                        className={`text-3xl font-black tracking-tight ${
                          isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
                        }`}
                      >
                        {selectedPreset.title}
                      </h3>
                    </div>

                    {/* Quick Metric Pills */}
                    <div className="flex items-center gap-2.5 text-xs font-bold">
                      <Reveal variant="stat" delay={120}>
                        <div
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-black/40 border-[#B5A595]/20 text-[#FFF4E6]'
                              : 'bg-white border-[#E5DDD2] text-[#1C1612]'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" />
                          <span>{selectedPreset.time}</span>
                        </div>
                      </Reveal>
                      <Reveal variant="stat" delay={210}>
                        <div
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-black/40 border-[#FF8A3D]/40 text-[#FF8A3D]'
                              : 'bg-white border-[#FF8A3D]/50 text-[#FF8A3D]'
                          }`}
                        >
                          <Dumbbell className="w-3.5 h-3.5 text-[#FF8A3D]" />
                          <span>{selectedPreset.protein} Protein</span>
                        </div>
                      </Reveal>
                      <Reveal variant="stat" delay={300}>
                        <div
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                            isDark
                              ? 'bg-black/40 border-[#B5A595]/20 text-[#FFF4E6]'
                              : 'bg-white border-[#E5DDD2] text-[#1C1612]'
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5 text-[#FF8A3D]" />
                          <span>{selectedPreset.calories}</span>
                        </div>
                      </Reveal>
                    </div>
                  </div>

                  {/* Summary */}
                  <p
                    className={`text-base leading-relaxed mb-8 font-normal ${
                      isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                    }`}
                  >
                    {selectedPreset.description}
                  </p>

                  {/* Recipe Body: Ingredients & Steps */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Ingredients Column */}
                    <div
                      className={`md:col-span-5 rounded-2xl p-5 border ${
                        isDark ? 'bg-black/30 border-[#B5A595]/15' : 'bg-white/60 border-[#E5DDD2]'
                      }`}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A3D] pb-3 border-b border-[#B5A595]/15 mb-4 flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Ingredients Needed</span>
                      </h4>
                      <ul className="space-y-3 text-sm">
                        {selectedPreset.ingredientsList.map((item, idx) => (
                          <li key={idx} className="flex items-start justify-between gap-2">
                            <span className={`font-semibold ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                              {item.item}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                              {item.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div
                      className={`md:col-span-7 rounded-2xl p-5 border ${
                        isDark ? 'bg-black/30 border-[#B5A595]/15' : 'bg-white/60 border-[#E5DDD2]'
                      }`}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF8A3D] pb-3 border-b border-[#B5A595]/15 mb-4 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Step-by-Step Directions (Plain English)</span>
                      </h4>
                      <ol className="space-y-4 text-sm">
                        {selectedPreset.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span
                              className={`font-black text-[#FF8A3D] text-xs w-6 h-6 rounded-lg flex items-center justify-center border border-[#FF8A3D]/40 shrink-0 mt-0.5 ${
                                isDark ? 'bg-[#FF8A3D]/10' : 'bg-[#FF8A3D]/15'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className={`leading-relaxed ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* NUTRITION SECTION: PROGRESS BAR REPRESENTATION (CHART REPLACED AS REQUESTED) */}
                  <Reveal
                    variant="chart"
                    delay={120}
                    className={`rounded-2xl border p-6 sm:p-7 mb-8 transition-colors ${
                      isDark ? 'bg-black/40 border-[#B5A595]/15' : 'bg-white/70 border-[#E5DDD2]'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-[#B5A595]/15 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF8A3D]/15 flex items-center justify-center">
                          <Activity className="w-4 h-4 text-[#FF8A3D]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-wider text-[#FF8A3D]">
                            Nutrition Overview
                          </h4>
                          <span className={`text-xs ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                            Macro values per serving
                          </span>
                        </div>
                      </div>
                      <div className={`text-xs font-semibold px-3 py-1 rounded-full ${isDark ? 'bg-white/5 text-[#FFF4E6]' : 'bg-neutral-100 text-[#1C1612]'}`}>
                        Total Calories: <span className="font-bold text-[#FF8A3D]">{selectedPreset.calories}</span>
                      </div>
                    </div>

                    {/* Progress Bar Rows: Carbs, Protein, Fat, Fiber */}
                    <div className="space-y-4 max-w-2xl">
                      {/* Carbs Row */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className={`w-24 font-bold tracking-tight ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Carbs
                          </span>
                          <span className="w-20 font-black text-[#FF8A3D]">
                            {selectedPreset.nutritionProfile.carbs}g
                          </span>
                          <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#ffaa6d] transition-all duration-700"
                              style={{ width: `${Math.min(100, Math.max(15, (selectedPreset.nutritionProfile.carbs / 60) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Protein Row */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className={`w-24 font-bold tracking-tight ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Protein
                          </span>
                          <span className="w-20 font-black text-[#FF8A3D]">
                            {selectedPreset.nutritionProfile.protein}g
                          </span>
                          <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#ffaa6d] transition-all duration-700"
                              style={{ width: `${Math.min(100, Math.max(15, (selectedPreset.nutritionProfile.protein / 40) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fat Row */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className={`w-24 font-bold tracking-tight ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Fat
                          </span>
                          <span className="w-20 font-black text-[#FF8A3D]">
                            {selectedPreset.nutritionProfile.fat}g
                          </span>
                          <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#ffaa6d] transition-all duration-700"
                              style={{ width: `${Math.min(100, Math.max(15, (selectedPreset.nutritionProfile.fat / 35) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Fiber Row */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className={`w-24 font-bold tracking-tight ${isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}`}>
                            Fiber
                          </span>
                          <span className="w-20 font-black text-[#FF8A3D]">
                            {selectedPreset.nutritionProfile.fiber}g
                          </span>
                          <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-neutral-200'}`}>
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#ffaa6d] transition-all duration-700"
                              style={{ width: `${Math.min(100, Math.max(15, (selectedPreset.nutritionProfile.fiber / 20) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plain English Insight */}
                    <div className="mt-5 pt-4 border-t border-[#B5A595]/15">
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                        💡 <strong className={isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'}>Insight: </strong>
                        {selectedPreset.nutritionProfile.summary}
                      </p>
                    </div>
                  </Reveal>

                  {/* Kitchen Note */}
                  <div
                    className={`rounded-2xl border p-4 mb-6 ${
                      isDark ? 'bg-black/30 border-[#B5A595]/20' : 'bg-white/60 border-[#E5DDD2]'
                    }`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF8A3D] mb-1 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-[#FF8A3D]" />
                      <span>No-Jargon Kitchen Note</span>
                    </div>
                    <p className={`text-xs leading-normal ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                      {selectedPreset.plainEnglishTip}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#B5A595]/20">
                    <button
                      onClick={() => setActiveStep(1)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                        isDark ? 'glass-btn-secondary-dark text-[#B5A595] hover:text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#6E6259] hover:text-[#1C1612]'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Edit Ingredients</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyRecipe}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                          isDark ? 'glass-btn-secondary-dark text-[#FFF4E6]' : 'glass-btn-secondary-light text-[#1C1612]'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#FF8A3D]" />
                            <span className="text-[#FF8A3D]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Recipe</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleTriggerGenerate}
                        className="px-5 py-2.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 active:scale-[0.98]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES SECTION (IMPROVISED, SIMPLIFIED & HUMAN-CENTRIC) */}
      <section
        id="capabilities"
        className={`py-20 md:py-28 border-b transition-colors relative ${
          isDark ? 'bg-[#0D0A08] border-[#B5A595]/15' : 'bg-[#FAF7F2] border-[#E5DDD2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <Reveal variant="heading" className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#FF8A3D] font-bold mb-3 border border-[#FF8A3D]/25 bg-[#FF8A3D]/10">
              Why PlateWise
            </div>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
                isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
              }`}
            >
              Cooking made simple for real everyday life.
            </h2>
            <p className={`text-base md:text-lg leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              No culinary school jargon, no expensive grocery runs. Here is how PlateWise helps you cook stress-free dinners.
            </p>
          </Reveal>

          {/* Improvised 4-Card Simple Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Cook With What You Have */}
            <Reveal
              variant="card"
              delay={90}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#ffaa6d] flex items-center justify-center text-[#0D0A08] mb-5 shadow-md">
                  <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2.5 ${
                    isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                  }`}
                >
                  Use What You Already Have
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  No last-minute grocery store runs. Snap whatever is left in your crisper drawer, and get meals that make real culinary sense.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#B5A595]/15 text-xs font-bold text-[#FF8A3D]">
                Zero extra shopping trips
              </div>
            </Reveal>

            {/* Card 2: Strict Dietary Matches */}
            <Reveal
              variant="card"
              delay={180}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#ffaa6d] flex items-center justify-center text-[#0D0A08] mb-5 shadow-md">
                  <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2.5 ${
                    isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                  }`}
                >
                  Strict Dietary Respect
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Pure veg, high-protein, or keto? Our rules are 100% strict filters. No hidden broths, meat additives, or surprise ingredients.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#B5A595]/15 text-xs font-bold text-[#FF8A3D]">
                100% guaranteed diet compliance
              </div>
            </Reveal>

            {/* Card 3: Zero Chef Jargon */}
            <Reveal
              variant="card"
              delay={270}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#ffaa6d] flex items-center justify-center text-[#0D0A08] mb-5 shadow-md">
                  <Utensils className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2.5 ${
                    isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                  }`}
                >
                  Zero Chef Jargon
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Forget terms like &ldquo;chiffonade&rdquo; or &ldquo;deglaze the fond&rdquo;. Steps are written in the plain conversational English you speak every day.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#B5A595]/15 text-xs font-bold text-[#FF8A3D]">
                Clear instructions for anyone
              </div>
            </Reveal>

            {/* Card 4: Cut Food Waste & Save Money */}
            <Reveal
              variant="card"
              delay={360}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all ${
                isDark ? 'glass-card-dark' : 'glass-card-light'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#ffaa6d] flex items-center justify-center text-[#0D0A08] mb-5 shadow-md">
                  <DollarSign className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3
                  className={`text-xl font-bold mb-2.5 ${
                    isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                  }`}
                >
                  Cut Food Waste & Save
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                  Stop throwing away soft produce and half-used herbs. The average household saves $140/month by turning odds and ends into hearty dinners.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#B5A595]/15 text-xs font-bold text-[#FF8A3D]">
                ~$1,680 / yr saved on groceries
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section
        id="faq"
        className={`py-20 md:py-28 border-b transition-colors relative ${
          isDark ? 'bg-[#0D0A08] border-[#B5A595]/15' : 'bg-[#FAF7F2] border-[#E5DDD2]'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal variant="heading" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider text-[#FF8A3D] font-bold mb-3 border border-[#FF8A3D]/25 bg-[#FF8A3D]/10">
              Clear Answers
            </div>
            <h2
              className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-3 ${
                isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
              }`}
            >
              Frequently Asked Questions
            </h2>
            <p className={`text-sm md:text-base ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              Everything you need to know about our ingredient recognition and recipe synthesis.
            </p>
          </Reveal>

          <div className="space-y-4">
            {[
              {
                q: 'How does PlateWise turn random ingredients into delicious meals?',
                a: 'PlateWise maps the flavor profiles and cooking temperatures of whatever produce you have on hand, pairing them with common kitchen staples like salt, oil, and basic herbs.',
              },
              {
                q: 'Can PlateWise strictly enforce pure vegetarian or vegan rules?',
                a: 'Yes. Our dietary filters are strict constraints. When Pure Veg or Vegan is enabled, the model completely disallows meats, gelatin, broths, and non-conforming additives.',
              },
              {
                q: 'What if I only have 2 or 3 random ingredients?',
                a: 'That is where PlateWise shines. It builds complete dishes using basic pantry staples rather than demanding an impossible grocery list of 15 exotic items.',
              },
              {
                q: 'Why do you avoid culinary terms like chiffonade or deglaze?',
                a: 'Food should be accessible. Cooking jargon alienates everyday home cooks. We translate professional culinary steps into plain, conversational sentences that anyone can execute with standard pans.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <Reveal key={idx} variant="card" delay={idx * 90}>
                  <div
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isDark ? 'glass-card-dark' : 'glass-card-light'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className={`w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base transition-colors ${
                        isDark ? 'hover:bg-white/[0.03] text-[#FFF4E6]' : 'hover:bg-black/[0.02] text-[#1C1612]'
                      }`}
                    >
                      <span>{faq.q}</span>
                      <div className="w-8 h-8 rounded-full bg-[#FF8A3D]/10 flex items-center justify-center shrink-0">
                        <ChevronDown
                          className={`w-4 h-4 text-[#FF8A3D] transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>
                    {isOpen && (
                      <div
                        className={`px-5 pb-5 text-sm leading-relaxed border-t pt-3 ${
                          isDark ? 'border-[#B5A595]/15 text-[#B5A595]' : 'border-[#E5DDD2] text-[#6E6259]'
                        }`}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <footer
        className={`pt-20 pb-16 border-t transition-colors ${
          isDark
            ? 'bg-[#0D0A08] text-[#FFF4E6] border-[#B5A595]/15'
            : 'bg-[#FAF7F2] text-[#1C1612] border-[#E5DDD2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Headline */}
          <Reveal
            variant="section"
            className={`pb-16 border-b grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              isDark ? 'border-[#B5A595]/15' : 'border-[#E5DDD2]'
            }`}
          >
            <div className="lg:col-span-7">
              <h2
                className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight mb-4 ${
                  isDark ? 'text-[#FFF4E6] headline-glow-lg' : 'text-[#1C1612]'
                }`}
              >
                Start cooking smarter.
              </h2>
              <p className={`text-base max-w-lg leading-relaxed ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                Zero food waste. Maximum protein. Step-by-step recipes written in the language you speak every day.
              </p>
            </div>

            {/* Newsletter / Instant Signup Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF8A3D] ${
                    isDark
                      ? 'bg-[#171210] border-[#B5A595]/30 text-[#FFF4E6] placeholder-[#B5A595]/50'
                      : 'bg-white border-[#E5DDD2] text-[#1C1612] placeholder-[#6E6259]/50'
                  }`}
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-extrabold uppercase tracking-wider whitespace-nowrap active:scale-[0.98]"
                >
                  Join Waitlist
                </button>
              </form>
              {waitlistSubmitted && (
                <div className="mt-2 text-xs text-[#FF8A3D] flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>You are on the list! Check your inbox for your access key.</span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Footer Subgrid Links */}
          <Reveal variant="section" delay={100} className="pt-12 pb-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-semibold">
            <div>
              <div
                className={`uppercase tracking-wider mb-4 font-bold ${
                  isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                }`}
              >
                Product
              </div>
              <ul className={`space-y-2.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                <li>
                  <button onClick={() => scrollToSection('upload-studio')} className="hover:text-[#FF8A3D] transition-colors">
                    Upload Photo
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#FF8A3D] transition-colors">
                    Three-Step Protocol
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('capabilities')} className="hover:text-[#FF8A3D] transition-colors">
                    Capabilities
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-[#FF8A3D] transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div
                className={`uppercase tracking-wider mb-4 font-bold ${
                  isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                }`}
              >
                Recipes
              </div>
              <ul className={`space-y-2.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Pure Veg Curries</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">High-Protein Tofu Bowls</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">15-Minute Skillet Veg</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Zero-Waste Crisper Soups</span></li>
              </ul>
            </div>

            <div>
              <div
                className={`uppercase tracking-wider mb-4 font-bold ${
                  isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                }`}
              >
                Philosophy
              </div>
              <ul className={`space-y-2.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">No Chef Jargon Policy</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Anti-Food Waste Mission</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Everyday Kitchen Grounding</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Accessibility First</span></li>
              </ul>
            </div>

            <div>
              <div
                className={`uppercase tracking-wider mb-4 font-bold ${
                  isDark ? 'text-[#FFF4E6]' : 'text-[#1C1612]'
                }`}
              >
                Platform
              </div>
              <ul className={`space-y-2.5 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Privacy & Data Security</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">API Documentation</span></li>
                <li><span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">System Status: Online</span></li>
              </ul>
            </div>
          </Reveal>

          {/* Bottom Line */}
          <div
            className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold ${
              isDark ? 'border-[#B5A595]/15 text-[#B5A595]/70' : 'border-[#E5DDD2] text-[#6E6259]'
            }`}
          >
            <div>
              &copy; {new Date().getFullYear()} PlateWise-AI. Built with everyday cooking simplicity. All rights reserved.
            </div>
            <div className={`flex items-center gap-6 ${isDark ? 'text-[#B5A595]' : 'text-[#6E6259]'}`}>
              <span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">Twitter / X</span>
              <span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">GitHub</span>
              <span className="hover:text-[#FF8A3D] cursor-pointer transition-colors">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>

      {/* 8. LIVE CAMERA VIEWFINDER MODAL (MOBILE & DESKTOP) */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#110D0B] border border-[#FF8A3D]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF8A3D] text-[#0D0A08] flex items-center justify-center font-black">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#FFF4E6] flex items-center gap-2">
                    <span>Direct Camera Capture</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8A3D]/20 text-[#FF8A3D] border border-[#FF8A3D]/30">
                      {facingMode === 'environment' ? 'Rear Camera' : 'Front Camera'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#B5A595]">
                    {capturedPhoto ? 'Review your snapshot before analyzing' : 'Center fresh product or fridge ingredients'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseCameraModal}
                className="w-8 h-8 rounded-xl bg-white/10 text-[#FFF4E6] hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Camera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] bg-black flex items-center justify-center overflow-hidden">
              {/* Shutter Flash Animation */}
              <div
                className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 z-30 ${
                  isFlashing ? 'opacity-90' : 'opacity-0'
                }`}
              />

              {capturedPhoto ? (
                /* Frozen Photo Review */
                <div className="relative w-full h-full flex items-center justify-center bg-black/90 p-2">
                  <img
                    src={capturedPhoto}
                    alt="Captured product"
                    className="max-h-[55vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow">
                    <Check className="w-3.5 h-3.5" />
                    <span>Photo Captured</span>
                  </div>
                </div>
              ) : (
                /* Real-Time Live Camera Feed */
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full max-h-[55vh] object-cover"
                  />

                  {/* Camera Framing Guidelines */}
                  <div className="absolute inset-8 sm:inset-12 border-2 border-white/25 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-t-2 border-l-2 border-[#FF8A3D]" />
                      <div className="w-5 h-5 border-t-2 border-r-2 border-[#FF8A3D]" />
                    </div>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[11px] font-semibold text-[#FFF4E6] border border-white/15">
                        Align fridge vegetables & ingredients
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-b-2 border-l-2 border-[#FF8A3D]" />
                      <div className="w-5 h-5 border-b-2 border-r-2 border-[#FF8A3D]" />
                    </div>
                  </div>

                  {cameraLoading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                      <RotateCcw className="w-8 h-8 animate-spin text-[#FF8A3D] mb-2" />
                      <p className="text-sm font-bold text-[#FFF4E6]">Starting camera lens...</p>
                      <p className="text-xs text-[#B5A595] mt-1">Please allow camera access in your browser.</p>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6">
                      <Camera className="w-10 h-10 text-[#FF8A3D] mb-3" />
                      <p className="text-sm font-bold text-[#FFF4E6] mb-1">{cameraError}</p>
                      <p className="text-xs text-[#B5A595] max-w-sm mb-4">
                        If browser permissions are blocked, you can use your device native camera directly.
                      </p>
                      <button
                        type="button"
                        onClick={handleDirectMobileCamera}
                        className="px-5 py-2.5 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Launch Mobile Camera</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Controls Bar */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              {capturedPhoto ? (
                /* Action buttons after clicking photo */
                <div className="w-full flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleRetakePhoto}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-white/5 text-[#FFF4E6] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retake</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmCapturedPhoto}
                    className="flex-1 py-3 px-4 rounded-xl glass-btn-primary text-[#0D0A08] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Use Photo & Analyze</span>
                  </button>
                </div>
              ) : (
                /* Live Shutter Controls */
                <div className="w-full flex items-center justify-between gap-3">
                  {/* Flip Camera Button */}
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-3 rounded-2xl border border-white/15 bg-white/5 text-[#FFF4E6] hover:bg-white/10 active:scale-90 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Flip camera front/back"
                  >
                    <RefreshCw className="w-4 h-4 text-[#FF8A3D]" />
                    <span className="hidden sm:inline">Flip</span>
                  </button>

                  {/* Primary Shutter Click Button */}
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={cameraLoading || !!cameraError}
                    className="group relative flex items-center justify-center cursor-pointer active:scale-90 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Click Photo"
                  >
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-[#FF8A3D] p-1 flex items-center justify-center shadow-[0_0_25px_rgba(255,138,61,0.4)]">
                      <div className="w-full h-full rounded-full bg-white group-hover:bg-[#FFF4E6] flex items-center justify-center text-[#0D0A08] transition-colors">
                        <Camera className="w-7 h-7 text-[#0D0A08] stroke-[2.2]" />
                      </div>
                    </div>
                  </button>

                  {/* Direct Native Camera Fallback */}
                  <button
                    type="button"
                    onClick={() => {
                      stopLiveCamera();
                      setIsCameraModalOpen(false);
                      cameraInputRef.current?.click();
                    }}
                    className="p-3 rounded-2xl border border-[#FF8A3D]/30 bg-[#FF8A3D]/10 text-[#FF8A3D] hover:bg-[#FF8A3D]/20 active:scale-90 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    title="Open device native camera"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Native App</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
