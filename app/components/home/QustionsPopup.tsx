/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client"

import { useEffect, useState } from "react"
import { Gem } from "lucide-react"
import crossPop from "~/assets/images/svg/cross.svg"
import diamondImg from "~/assets/images/demo/diamondreal.png"
import { Image } from "@shopify/hydrogen"
import { useRingQuizOne } from "~/hooks/QustionsPopup/useRingQuizOne"
import { useBraceletQuiz } from "~/hooks/QustionsPopup/useBraceletQuiz"
import { usePendantQuiz } from "~/hooks/QustionsPopup/usePendantQuiz"

interface ShoppingOption {
  id: string
  title: string
  image: string
  alt: string
}

interface JewelryCategory {
  id: string
  name: string
  image: string
}

type PendantQuizInput = {
  selectedCarat: string
  selectedShape: string
  selectedMetalColor: string
}

interface QuizStep {
  id: number
  title: string
  subtitle: string
  note: string
  question?: string
  type:
    | "multiple-choice"
    | "shape-selection"
    | "email-capture"
    | "ring-display"
    | "diamond-shape-selection"
    | "image-options"
    | "diamond-size-selection"
  options?: { id: string; label: string }[]
  shapes?: { id: string; color?: string; shape?: string; name?: string }[]
  rings?: { id: string; image: string; query?: string }[]
  imageOptions?: { id: string; image: string; label: string }[]
  diamondSizes?: { id: string; label: string; sizeClass: string }[]
  background: string
}

type QuizType = "tie-knot" | "upgrade" | "earrings" | "necklaces" | "bracelets" | "pendant"

type QuizInput = {
  shapes: string[]
  talentShow: string
  promJewelry: string
  gloveSize: string
}

type BraceletQuizInput = {
  perStoneSize: string
  diamondShape: string
  metalColor: string
  totalCaratWeight: string
}

interface QuizState {
  currentStep: number
  answers: Record<string, any>
  selectedShapes: string[]
  selectedDiamondSize: string | null
}

const jewelryCategories: JewelryCategory[] = [
  { id: "rings", name: "Rings", image: "/question/ringspop.png" },
  { id: "earrings", name: "Earrings", image: "/question/earringpop.png" },
  { id: "necklaces", name: "Necklaces", image: "/question/necklacepop.png" },
  { id: "bracelets", name: "Bracelets", image: "/question/bracelatepop.png" },
  { id: "pendant", name: "Pendant", image: "/question/pendent.png" },
  { id: "loose-diamonds", name: "Loose Diamonds", image: "/question/loose-diamond.png" },
]

const curatedCategories: JewelryCategory[] = jewelryCategories.slice(0, 5)

const shoppingOptions: ShoppingOption[] = [
  {
    id: "window-shopping",
    title: "I'm just window shopping",
    image: "/question/shopping.png",
    alt: "I'm just window shopping",
  },
  {
    id: "tie-knot",
    title: "It's time to tie the knot",
    image: "/question/knot.png",
    alt: "It's time to tie the knot",
  },
  {
    id: "upgrade",
    title: "It's time for an upgrade!",
    image: "/question/upgrade.png",
    alt: "It's time for an upgrade!",
  },
  {
    id: "jewelry-expert",
    title: "Jewelry is my thing, I got this",
    image: "/question/jewelery.png",
    alt: "Jewelry is my thing, I got this",
  },
]

const createQuizSteps = (category: string): QuizStep[] => {
  const baseBackground = `/placeholder.svg?height=600&width=800`
  const categoryBackground = (step: number) => `/public/images/${category}-quiz-step${step}.png`

  const commonShapes = [
    { id: "round", name: "Round" },
    { id: "princess", name: "Princess" },
    { id: "cushion", name: "Cushion" },
    { id: "oval", name: "Oval" },
    { id: "emerald", name: "Emerald" },
    { id: "asscher", name: "Asscher" },
    { id: "pear", name: "Pear" },
    { id: "marquise", name: "Marquise" },
    { id: "heart", name: "Heart" },
  ]

  const metalOptions = [
    { id: "rose-gold", label: "A.) Soft & Romantic <span class='text-pink-300'>Rose Gold</span>" },
    { id: "yellow-gold", label: "B.) Bold & Timeless <span class='text-yellow-400'>Yellow Gold</span>" },
    { id: "white-gold", label: "C.) Sleek & Modern <span class='text-gray-300'>White Gold</span>" },
  ]

  if (category === "tie-knot") {
    return [
      {
        id: 1,
        title: "Back in your partner's crayon-wielding days,",
        subtitle: "which shape would they have doodled?",
        note: "(aside from the occasional masterpiece on the wall)",
        question: "",
        type: "shape-selection",
        shapes: [
          { id: "circle", color: "bg-blue-400", shape: "rounded-full" },
          { id: "square", color: "bg-yellow-400", shape: "rounded-none" },
          { id: "triangle", color: "bg-orange-400", shape: "triangle" },
          { id: "oval", color: "bg-blue-600", shape: "rounded-full transform scale-y-75" },
          { id: "rectangle", color: "bg-green-400", shape: "rounded-sm" },
          { id: "heart", color: "bg-red-400", shape: "heart" },
        ],
        background: baseBackground,
      },
      {
        id: 2,
        title: "It's time to adult!",
        subtitle: "The house is a mess...",
        note: "(Latex is needed... lol)",
        question: "What size gloves does your partner wear?",
        type: "multiple-choice",
        options: [
          { id: "X-Small", label: "A.) X-Small" },
          { id: "Small", label: "B.) Small" },
          { id: "Medium", label: "C.) Medium" },
          { id: "Large", label: "D.) Large" },
        ],
        background: baseBackground,
      },
      {
        id: 3,
        title: "It's Time For The Middle School Talent Show!",
        subtitle: "Your partner is ...",
        note: "",
        question: "",
        type: "multiple-choice",
        options: [
          { id: "Center Stage", label: "A.) Center stage; singing and dancing" },
          { id: "In the Crowd", label: "B.) Hanging with their friends in the crowd" },
          { id: "Not Attending", label: "C.) Forget it, not attending" },
        ],
        background: baseBackground,
      },
      
      {
        id: 4,
        title: "The Concierge HANDPICKED",
        subtitle: "These Just for YOU!",
        note: "",
        question: "",
        type: "ring-display",
        rings: [
          { id: "solitaire", image: "/placeholder.svg?height=120&width=120" },
          { id: "vintage", image: "/placeholder.svg?height=120&width=120" },
          { id: "classic", image: "/placeholder.svg?height=120&width=120" },
          { id: "halo", image: "/placeholder.svg?height=120&width=120" },
        ],
        background: baseBackground,
      },
      {
        id: 5,
        title: "The Concierge Has Graded Your QUIZ.",
        subtitle: "Quick Question...",
        note: "",
        question: "Were you always the Teachers Pet?",
        type: "email-capture",
        background: baseBackground,
      },
      {
        id: 6,
        title: "It's High School Prom...",
        subtitle: 'You\'re date "sparkles" next to you.',
        note: "",
        question: "Their attire includes...",
        type: "multiple-choice",
        options: [
          { id: "Full Sparkle", label: "A.) Necklace, earrings, bracelet, watch" },
          { id: "Necklace & Earrings", label: "B.) Necklace & earrings" },
          { id: "Earrings Only", label: "C.) Earrings" },
          { id: "No Jewelry", label: "D.) No jewelry" },
        ],
        background: baseBackground,
      },
    ]
  }

  if (category === "upgrade") {
    return [
      {
        id: 1,
        title: "One Last Thing...",
        subtitle: "How Important is PERFECTION to You?",
        note: "(It's starting to feel like we're writing your first dating profile, right?)",
        type: "multiple-choice",
        options: [
          { id: "if", label: "A.) IF - Flawless Sparkle" },
          { id: "vvs1", label: "B.) VVS1 - Nearly Perfect" },
          { id: "vvs2", label: "C.) VVS2 - Ultra Clear" },
          { id: "vs1", label: "D.) VS1 - Crystal Clear" },
          { id: "vs2", label: "E.) VS2 - Clear With Character" },
        ],
        background: baseBackground,
      },
      {
        id: 2,
        title: "What Letter Do You Love The Most?",
        subtitle: "",
        note: "(Hint: its all about the Diamond color!)",
        type: "multiple-choice",
        options: [
          { id: "d", label: "A.) D - Icy White" },
          { id: "e", label: "B.) E - Bright White" },
          { id: "f", label: "C.) F - Soft White" },
        ],
        background: baseBackground,
      },
      {
        id: 3,
        title: "Fresh & Fine",
        subtitle: "What's Next For Your Collection?",
        note: "",
        type: "ring-display",
        rings: Array.from({ length: 4 }, (_, i) => ({
          id: `ring${i + 1}`,
          image: "/placeholder.svg?height=120&width=120",
        })),
        background: baseBackground,
      },
      {
        id: 4,
        title: "Upgrades Are PERSONAL ...",
        subtitle: "What's your fancy?",
        note: "(Click a Diamond Shape)",
        type: "diamond-shape-selection",
        shapes: commonShapes.map((shape) => ({
          ...shape,
          name: `${shape.name} - ${
            shape.id === "round"
              ? "Classic Brilliance"
              : shape.id === "princess"
                ? "Modern Square"
                : shape.id === "cushion"
                  ? "Soft Corners"
                  : shape.id === "oval"
                    ? "Elegant Elongation"
                    : shape.id === "emerald"
                      ? "Step-Cut Sophistication"
                      : shape.id === "asscher"
                        ? "Vintage Sparkle"
                        : shape.id === "pear"
                          ? "Teardrop Elegance"
                          : shape.id === "marquise"
                            ? "Bold Elongation"
                            : "Romantic Glow"
          }`,
        })),
        background: baseBackground,
      },
      {
        id: 5,
        title: "As We Get Older, Upgrades Become A Reality...",
        subtitle: "What's your story?",
        note: "",
        type: "multiple-choice",
        options: [
          { id: "milestone", label: "A.) It's a milestone." },
          { id: "afford-dream", label: "B.) We can finally afford my dream ring." },
          { id: "celebrates-come", label: "C.) This upgrade celebrates how far I've come." },
          { id: "renewing-vows", label: "D.) We're renewing vows." },
          { id: "none-fit", label: "E.) None of these fit... next question!" },
        ],
        background: baseBackground,
      },
      {
        id: 6,
        title: "Fresh & Fine",
        subtitle: "What's Next For Your Collection?",
        note: "",
        type: "ring-display",
        rings: Array.from({ length: 4 }, (_, i) => ({
          id: `ring${i + 5}`,
          image: "/placeholder.svg?height=120&width=120",
        })),
        background: baseBackground,
      },
    ]
  }

  // Generic jewelry category quiz
  const sizeOptions =
    category === "earrings"
      ? ["2ctw", "3ctw", "4ctw", "5ctw", "6ctw", "7ctw"]
      : category === "necklaces"
        ? ["5ctw", "10ctw", "15ctw", "20ctw"]
        : category === "bracelets"
          ? ["4ctw", "5ctw", "7ctw", "10ctw", "12ctw", "15ctw", "20ctw+"]
          : ["2ctw", "3ctw", "4ctw", "5ctw", "6ctw", "7ctw"]

  return [
    {
      id: 1,
      title: `If ${
        category === "earrings"
          ? "Your DIAMOND Earrings Were Compared To A Nut"
          : category === "necklaces"
            ? "The DIAMONDS on Your Necklace Were A Candy"
            : category === "bracelets"
              ? "The DIAMONDS on Your Bracelet Were A Candy"
              : "Your DIAMOND Pendant Is Compared To A Nut"
      }`,
      subtitle: "Which size would they be?",
      note: `(Select A Type Of ${category === "earrings" || category === "pendant" ? "Nut" : "Candy"})`,
      type: "image-options",
      imageOptions: [
        {
          id: "sunflower",
          image: "/placeholder.svg?height=80&width=80",
          label: category === "necklaces" || category === "bracelets" ? ".10ct" : "Sunflower Seed",
        },
        {
          id: "peanut",
          image: "/placeholder.svg?height=80&width=80",
          label: category === "necklaces" || category === "bracelets" ? ".15ct" : "Peanut",
        },
        {
          id: "almond",
          image: "/placeholder.svg?height=80&width=80",
          label: category === "necklaces" || category === "bracelets" ? ".25ct" : "Almond",
        },
        {
          id: "pecan",
          image: "/placeholder.svg?height=80&width=80",
          label: category === "necklaces" || category === "bracelets" ? ".50ct" : "Pecan",
        },
        ...(category === "necklaces" || category === "bracelets"
          ? [{ id: "large", image: "/placeholder.svg?height=80&width=80", label: ".75ct +" }]
          : []),
      ],
      background: categoryBackground(1),
    },
    {
      id: 2,
      title: `If Your ${category.charAt(0).toUpperCase() + category.slice(1)} ${category === "earrings" ? "Were" : category === "pendant" ? "Was A" : "Were"} Food`,
      subtitle: "What shape is on your plate?",
      note: "(Select A Type Of Food)",
      type: "image-options",
      imageOptions: commonShapes.map((shape) => ({
        id: shape.id,
        image: "/placeholder.svg?height=80&width=80",
        label: shape.name,
      })),
      background: categoryBackground(2),
    },
    {
      id: 3,
      title: "If Your JEWELRY Had Personality",
      subtitle: "What color would it be?",
      note: "",
      type: "multiple-choice",
      options: metalOptions,
      background: categoryBackground(3),
    },
    {
      id: 4,
      title: "Who Says Size Doesn't MATTER?",
      subtitle: "How much can you handle?",
      note: "(Select A Diamond)",
      type: "diamond-size-selection",
      diamondSizes: sizeOptions.map((size, index) => ({
        id: size,
        label: size,
        sizeClass: `w-${10 + index * 2} h-${10 + index * 2}`,
      })),
      background: categoryBackground(4),
    },
    {
      id: 5,
      title: "Fresh & Fine",
      subtitle: "What's Next For Your Collection?",
      note: "",
      type: "ring-display",
      rings: Array.from({ length: 4 }, (_, i) => ({
        id: `${category}${i + 1}`,
        image: "/placeholder.svg?height=120&width=120",
        query:
          category === "necklaces"
            ? [
                "emerald cut diamond necklace",
                "delicate diamond chain necklace",
                "tennis necklace",
                "solitaire diamond pendant necklace",
              ][i]
            : category === "bracelets"
              ? [
                  "diamond tennis bracelet",
                  "gold chain bracelet with diamonds",
                  "diamond bangle bracelet",
                  "delicate diamond bracelet",
                ][i]
              : category === "pendant"
                ? [
                    "round diamond pendant",
                    "emerald cut diamond pendant",
                    "solitaire diamond pendant",
                    "square diamond pendant",
                  ][i]
                : undefined,
      })),
      background: categoryBackground(5),
    },
  ]
}

export default function QustionsPopup() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showCollection, setShowCollection] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState<QuizType | null>(null)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Consolidated quiz states
  const [quizStates, setQuizStates] = useState<Record<QuizType, QuizState>>({
    "tie-knot": { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    upgrade: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    earrings: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    necklaces: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    bracelets: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    pendant: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
  })

  // Get tie-knot quiz data for the hook
  const getTieKnotQuizInput = (): QuizInput | null => {
    const tieKnotState = quizStates["tie-knot"]
    const answers = tieKnotState.answers

    if (answers[1] && answers[2] && answers[3] && answers[6]) {
      return {
        gloveSize: answers[1],
        talentShow: answers[2],
        shapes: Array.isArray(answers[3]) ? answers[3] : [answers[3]],
        promJewelry: answers[6],
      }
    }
    return null
  }

  // Get bracelet quiz data for the hook
  const getBraceletQuizInput = (): BraceletQuizInput | null => {
    const braceletState = quizStates["bracelets"]
    const answers = braceletState.answers

    // Check if we have all required answers (steps 1-4)
    if (answers[1] && answers[2] && answers[3] && answers[4]) {
      // Map quiz answers to hook input format
      const sizeMapping: Record<string, string> = {
        sunflower: "0.10ct",
        peanut: "0.15ct",
        almond: "0.25ct",
        pecan: "0.50ct",
        large: "0.75ct",
      }

      const shapeMapping: Record<string, string> = {
        round: "Round",
        princess: "Princess",
        cushion: "Cushion",
        oval: "Oval",
        emerald: "Emerald",
        asscher: "Asscher",
        pear: "Pear",
        marquise: "Marquise",
        heart: "Heart",
      }

      const metalMapping: Record<string, string> = {
        "rose-gold": "Rose Gold",
        "yellow-gold": "Yellow Gold",
        "white-gold": "White Gold",
      }

      return {
        perStoneSize: sizeMapping[answers[1]] || answers[1],
        diamondShape: shapeMapping[answers[2]] || answers[2],
        metalColor: metalMapping[answers[3]] || answers[3],
        totalCaratWeight: answers[4], 
      }
    }
    return null
  }

  const getPendantQuizInput = (): PendantQuizInput | null => {
  const pendantState = quizStates["pendant"]
  const answers = pendantState.answers

  // Check if we have all required answers (steps 1-3)
  if (answers[1] && answers[2] && answers[3]) {
    // Map quiz answers to hook input format
    const caratMapping: Record<string, string> = {
      sunflower: "1ct",
      peanut: "0.15ct", 
      almond: "0.25ct",
      pecan: "0.50ct",
      large: "0.75ct",
    }

    const shapeMapping: Record<string, string> = {
      round: "Round",
      princess: "Princess",
      cushion: "Cushion",
      oval: "Oval",
      emerald: "Emerald",
      asscher: "Asscher",
      pear: "Pear",
      marquise: "Marquise",
      heart: "Heart",
    }

    const metalMapping: Record<string, string> = {
      "rose-gold": "Rose Gold",
      "yellow-gold": "Yellow Gold", 
      "white-gold": "White Gold",
    }

    return {
      selectedCarat: caratMapping[answers[1]] || answers[1],
      selectedShape: shapeMapping[answers[2]] || answers[2],
      selectedMetalColor: metalMapping[answers[3]] || answers[3],
    }
  }
  return null
}

  // Use the ring quiz hook for tie-knot quiz
  const tieKnotInput = getTieKnotQuizInput()
  const braceletInput = getBraceletQuizInput()
  const pendantInput = getPendantQuizInput()

  const ringQuizResult = useRingQuizOne(
    "/public/question/csv/Tie-The-Knot-Engagement-Ring.csv",
    tieKnotInput || {
      shapes: [],
      talentShow: "",
      promJewelry: "",
      gloveSize: "",
    },
  )

  const { isLoading, braceletData } = useBraceletQuiz(
    "/question/csv/Bracelet_Quiz.csv",
     braceletInput || {
      perStoneSize: "",
      diamondShape: "",
      metalColor: "",
      totalCaratWeight: "",
    },
  )

  const { isLoading: pendantLoading, pendantData } = usePendantQuiz(
  "/question/csv/Pendant_Quiz.csv",
  pendantInput || {
    selectedCarat: "",
    selectedShape: "",
    selectedMetalColor: "",
  },
)
  const resetQuizState = (quizType: QuizType) => {
    setQuizStates((prev) => ({
      ...prev,
      [quizType]: { currentStep: 1, answers: {}, selectedShapes: [], selectedDiamondSize: null },
    }))
  }

  const updateQuizState = (quizType: QuizType, updates: Partial<QuizState>) => {
    setQuizStates((prev) => ({
      ...prev,
      [quizType]: { ...prev[quizType], ...updates },
    }))
  }

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
    setShowCollection(false)
    setShowUpgrade(false)
    setActiveQuiz(null)

    if (optionId === "window-shopping") {
      setShowCollection(true)
    } else if (optionId === "tie-knot") {
      setActiveQuiz("tie-knot")
      resetQuizState("tie-knot")
    } else if (optionId === "upgrade") {
      setShowUpgrade(true)
    }
  }

  const handleQuizAnswer = (answer: any, quizType: QuizType) => {
    const currentState = quizStates[quizType]
    const quizSteps = createQuizSteps(quizType)

    updateQuizState(quizType, {
      answers: { ...currentState.answers, [currentState.currentStep]: answer },
    })

    if (currentState.currentStep < quizSteps.length) {
      updateQuizState(quizType, { currentStep: currentState.currentStep + 1 })
    }
  }

  const handleShapeSelection = (shapeId: string, quizType: QuizType) => {
    const currentState = quizStates[quizType]
    const maxSelections = quizType === "tie-knot" ? 2 : 1

    let newShapes: string[]
    if (currentState.selectedShapes.includes(shapeId)) {
      newShapes = currentState.selectedShapes.filter((id) => id !== shapeId)
    } else if (currentState.selectedShapes.length < maxSelections) {
      newShapes = [...currentState.selectedShapes, shapeId]
    } else if (maxSelections === 1) {
      newShapes = [shapeId]
    } else {
      return
    }

    updateQuizState(quizType, { selectedShapes: newShapes })
  }

  const handleDiamondSizeSelection = (sizeId: string, quizType: QuizType) => {
    updateQuizState(quizType, { selectedDiamondSize: sizeId })
  }

  const handleQuizNavigation = (step: number, quizType: QuizType) => {
    updateQuizState(quizType, { currentStep: step })
  }

  const handleCuratedCategoryClick = (categoryId: string) => {
    const quizType = categoryId as QuizType
    setActiveQuiz(quizType)
    resetQuizState(quizType)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedOption(null)
    setShowCollection(false)
    setShowUpgrade(false)
    setActiveQuiz(null)
    setEmail("")
    // Reset all quiz states
    Object.keys(quizStates).forEach((key) => {
      resetQuizState(key as QuizType)
    })
  }

  const handleBackToOptions = () => {
    setShowCollection(false)
    setShowUpgrade(false)
    setActiveQuiz(null)
    setSelectedOption(null)
    setEmail("")
  }

  const handleBackToUpgradeCategories = () => {
    setActiveQuiz(null)
  }

  const renderQuizContent = (quizType: QuizType) => {
    const quizSteps = createQuizSteps(quizType)
    const currentState = quizStates[quizType]
    const currentStep = quizSteps[currentState.currentStep - 1]

    if (!currentStep) return null


    return (
      <div className="relative h-screen">
        <div
          className="absolute inset-0 h-full"
          style={{
            backgroundImage: `url(${currentStep.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: currentStep.background.includes("black and white") ? 0.8 : 0.9,
          }}
        >
          {/* Specific overlays for certain steps */}
          {/* {quizType === "tie-knot" && currentState.currentStep === 2 && (
            <div className="absolute inset-0 bg-black">
              <div className="absolute top-10 left-20 w-32 h-32 bg-white opacity-20 rounded-full blur-3xl"></div>
              <div className="absolute top-10 right-20 w-32 h-32 bg-white opacity-20 rounded-full blur-3xl"></div>
            </div>
          )}
          {quizType === "tie-knot" && (currentState.currentStep === 3 || currentState.currentStep === 4) && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
          )}
          {quizType === "tie-knot" && currentState.currentStep === 6 && (
            <div className="absolute inset-0 bg-black opacity-50"></div>
          )} */}
        </div>

        <div className="relative z-10 p-8">
          <button
            onClick={quizType === "tie-knot" ? handleBackToOptions : handleBackToUpgradeCategories}
            className="mb-6 text-primary outfit flex items-center gap-2"
          >
            ← Back to {quizType === "tie-knot" ? "Options" : "Categories"}
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-[28px] leading-[32px] md:text-[45px] md:leading-[46px] plaifairsb text-primary">{currentStep.title}</h2>
              <h3 className="ext-[28px] leading-[32px] md:text-[45px] md:leading-[46px] plaifairsb text-primary">{currentStep.subtitle}</h3>
              {currentStep.note && <p className="text-[18px] text-primary outfit italic mb-4">{currentStep.note}</p>}
              {currentStep.question && <p className="text-xl text-primary">{currentStep.question}</p>}
            </div>

            {/* Display ring quiz results for tie-knot quiz when we have complete data */}
            {quizType === "tie-knot" && tieKnotInput && (
              <div className="mb-6 p-4 bg-black bg-opacity-50 rounded-lg">
                <h4 className="text-primary text-lg mb-2">Quiz Results:</h4>
                <p className="text-primary">Personality: {ringQuizResult.personality}</p>
                <div className="text-sm text-gray-300 mt-2">
                  <p>Ring Data: {JSON.stringify(ringQuizResult.ringData, null, 2)}</p>
                </div>
              </div>
            )}

            {/* Display bracelet quiz results when we have complete data */}
            {quizType === "bracelets" && braceletInput && braceletData && (
              <div className="mb-6 p-4 bg-black bg-opacity-50 rounded-lg">
                <h4 className="text-primary text-lg mb-2">Bracelet Quiz Results:</h4>
                {isLoading ? (
                  <p className="text-primary">Loading recommendations...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary text-sm">
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="font-semibold mb-1">Suggestion 1:</h5>
                      <p>{braceletData.suggestion1.summary}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="font-semibold mb-1">Suggestion 2:</h5>
                      <p>{braceletData.suggestion2.summary}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="font-semibold mb-1">Suggestion 3:</h5>
                      <p>{braceletData.suggestion3.summary}</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded">
                      <h5 className="font-semibold mb-1">Suggestion 4:</h5>
                      <p>{braceletData.suggestion4.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            {quizType === "pendant" && pendantInput && pendantData && (
  <div className="mb-6 p-4 bg-black bg-opacity-50 rounded-lg">
    <h4 className="text-primary text-lg mb-2">Pendant Quiz Results:</h4>
    {pendantLoading ? (
      <p className="text-primary">Loading recommendations...</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary text-sm">
        {pendantData.suggestion1 && (
          <div className="bg-gray-800 p-3 rounded">
            <h5 className="font-semibold mb-1">Suggestion 1:</h5>
            <p>{pendantData.suggestion1.summary}</p>
          </div>
        )}
        {pendantData.suggestion2 && (
          <div className="bg-gray-800 p-3 rounded">
            <h5 className="font-semibold mb-1">Suggestion 2:</h5>
            <p>{pendantData.suggestion2.summary}</p>
          </div>
        )}
        {pendantData.suggestion3 && (
          <div className="bg-gray-800 p-3 rounded">
            <h5 className="font-semibold mb-1">Suggestion 3:</h5>
            <p>{pendantData.suggestion3.summary}</p>
          </div>
        )}
        {pendantData.suggestion4 && (
          <div className="bg-gray-800 p-3 rounded">
            <h5 className="font-semibold mb-1">Suggestion 4:</h5>
            <p>{pendantData.suggestion4.summary}</p>
          </div>
        )}
      </div>
    )}
  </div>
)}

            {/* Quiz Content Based on Type */}
            {currentStep.type === "multiple-choice" && (
              <div className="space-y-4 mb-8">
                {currentStep.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleQuizAnswer(option.id, quizType)}
                    className="block w-full max-w-md mx-auto text-left text-primary text-lg py-3 px-6 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 border border-white hover:border-white"
                  >
                    <span dangerouslySetInnerHTML={{ __html: option.label }} />
                  </button>
                ))}
              </div>
            )}

            {currentStep.type === "shape-selection" && (
              <div className="mb-8">
                <div className="flex justify-center gap-6 mb-4 flex-wrap">
                  {currentStep.shapes?.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => handleShapeSelection(shape.id, quizType)}
                      className={`w-16 h-16 ${shape.color} ${shape.shape} border-4 transition-all duration-300 ${
                        currentState.selectedShapes.includes(shape.id)
                          ? "border-white scale-110"
                          : "border-white hover:border-white"
                      }`}
                    ></button>
                  ))}
                </div>
                <p className="text-primary mb-4">(Select up to {quizType === "tie-knot" ? "2" : "1"} shapes)</p>
                {currentState.selectedShapes.length > 0 && (
                  <button
                    onClick={() => handleQuizAnswer(currentState.selectedShapes, quizType)}
                    className="bg-blue-600 text-primary px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {currentStep.type === "ring-display" && (
              <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {currentStep.rings?.map((ring) => (
                    <button
                      key={ring.id}
                      onClick={() => handleQuizAnswer(ring.id, quizType)}
                      className="bg-white p-4 rounded-lg hover:scale-105 transition-transform duration-300"
                    >
                      <img
                        src={ring.image || "/placeholder.svg"}
                        alt={`${quizType} option`}
                        className="w-full h-24 object-contain"
                      />
                    </button>
                  ))}
                </div>
                {quizType === "tie-knot" && currentState.currentStep === 4 && (
                  <div className="border-t border-gray-600 pt-6">
                    <p className="text-primary text-xl mb-4">
                      Not Quite Your Style? No Worries - Your Perfect Ring Is Out There
                    </p>
                    <button
                      onClick={() => handleQuizAnswer("custom", quizType)}
                      className="text-primary text-lg underline hover:text-blue-400 transition-colors"
                    >
                      Design your dream ring with our Ring Builder
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep.type === "diamond-shape-selection" && (
              <div className="mb-8">
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4 max-w-2xl mx-auto">
                  {currentStep.shapes?.map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => handleShapeSelection(shape.id, quizType)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                        currentState.selectedShapes.includes(shape.id)
                          ? "bg-white text-black"
                          : "bg-gray-700 text-primary hover:bg-gray-600"
                      }`}
                    >
                      <Gem
                        className={`w-10 h-10 ${
                          currentState.selectedShapes.includes(shape.id) ? "text-blue-500" : "text-gray-300"
                        }`}
                      />
                      <span className="text-xs mt-1">{shape.name}</span>
                    </button>
                  ))}
                </div>
                {currentState.selectedShapes.length > 0 && (
                  <button
                    onClick={() => handleQuizAnswer(currentState.selectedShapes[0], quizType)}
                    className="bg-blue-600 text-primary px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {currentStep.type === "image-options" && (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {currentStep.imageOptions?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleQuizAnswer(option.id, quizType)}
                      className="flex flex-col items-center justify-center p-4 rounded-lg bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300 border border-gray-600 hover:border-white"
                    >
                      <img
                        src={option.image || "/placeholder.svg"}
                        alt={option.label}
                        className="w-20 h-20 object-contain mb-2"
                      />
                      <span className="text-primary text-lg">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep.type === "diamond-size-selection" && (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {currentStep.diamondSizes?.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => handleDiamondSizeSelection(size.id, quizType)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all duration-300 ${
                        currentState.selectedDiamondSize === size.id
                          ? "bg-white text-black"
                          : "bg-black bg-opacity-30 text-primary hover:bg-opacity-50 border border-gray-600 hover:border-white"
                      }`}
                    >
                      <Gem
                        className={`${size.sizeClass} ${
                          currentState.selectedDiamondSize === size.id ? "text-blue-500" : "text-gray-300"
                        }`}
                      />
                      <span className="text-lg mt-2">{size.label}</span>
                    </button>
                  ))}
                </div>
                {currentState.selectedDiamondSize && (
                  <button
                    onClick={() => handleQuizAnswer(currentState.selectedDiamondSize, quizType)}
                    className="bg-blue-600 text-primary px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
                  >
                    Continue
                  </button>
                )}
              </div>
            )}

            {currentStep.type === "email-capture" && (
              <div className="mb-8">
                <div className="max-w-md mx-auto space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-full bg-black bg-opacity-50 text-primary placeholder-gray-400 border border-gray-600 focus:border-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuizAnswer(email, quizType)}
                    className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                  >
                    See your results
                  </button>
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              {[...Array(quizSteps.length)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handleQuizNavigation(index + 1, quizType)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    index + 1 === currentState.currentStep
                      ? "bg-white text-black border-white"
                      : index + 1 < currentState.currentStep
                        ? "bg-gray-600 text-primary border-gray-600"
                        : "bg-transparent text-primary border-gray-400 hover:border-white"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (<>
  {isModalOpen && (
       <div className="fixed inset-0 bg-gradient-custom flex items-center justify-center z-[100] overflow-y-auto custom-scroll">
          <div className="relative w-full max-h-full overflow-y-auto custom-scroll bg-[url('/bgelement.png')]">
            <button onClick={closeModal} className="absolute top-6 right-4 z-300">
              <Image src={crossPop || "/placeholder.svg"} alt="" />
            </button>

            {showCollection ? (
              <div
                className="relative w-full"
                style={{
                  backgroundImage: `url('/black-gold-glitter-background.png')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="relative z-10 p-8">
                  <button
                    onClick={handleBackToOptions}
                    className="mb-6 outfit text-primary  transition-colors flex items-center gap-2"
                  >
                    ← Back to Options
                  </button>
                  <div className="text-center mb-12">
                    <h2 className="text-[28px] mb-3 leading-[30px] md:text-[56px] md:leading-[56px] playfair text-primary">
                      Exclusively Hand Forged
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <span><Image src={diamondImg} alt=""/></span>
                      <h3 className="text-[29px] italic leading-[30px] md:text-[35px] md:leading-[36px] playfairsb text-primary mb-2">The Bello Collection</h3>
                      <span><Image src={diamondImg} alt=""/></span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-25 mx-auto">
                    {jewelryCategories.map((category) => (
                      <div
                        key={category.id}
                        className="group cursor-pointer"
                      >
                        <div className="border-[5px] border-white">
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <h4 className="text-primary italic text-[20px] md:text-[38px] md:leading-[42px] text-center leading-[23px] playfairsb">
                          {category.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeQuiz ? (
              renderQuizContent(activeQuiz)
            ) : showUpgrade ? (
              <div
                className="relative min-h-[600px] p-8"
                style={{
                  backgroundImage: `url('/placeholder.svg?height=600&width=800')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div className="relative z-10 text-center">
                  <button
                    onClick={handleBackToOptions}
                    className="absolute outfit top-0 left-0 mb-6 text-primary hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    ← Back to Options
                  </button>
                  <div className="mb-12 pt-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">Curated Just For You...</h2>
                    <p className="text-xl text-gray-300">Select a category 🙂</p>
                  </div>
                  <div className="flex justify-center flex-wrap gap-6 max-w-5xl mx-auto">
                    {curatedCategories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCuratedCategoryClick(category.id)}
                        className="group cursor-pointer transition-all duration-300 hover:scale-105"
                      >
                        <div className="bg-white rounded-lg p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <div className="aspect-square w-32 h-32 mb-3 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center">
                            <img
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>
                        <h4 className="text-primary text-center mt-3 font-medium text-lg group-hover:text-blue-400 transition-colors">
                          {category.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center py-8 px-6 border-gradient-custom border-b-0 mb-8">
                  <h2 className="text-[28px] leading-[30px] playfair md:text-[56px] md:leading-[57px] font-normal text-primary">
                    What would you like
                  </h2>
                  <h2 className="text-[28px] playfair md:text-[56px] font-normal text-primary">to shop for today?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-2 bg-[url('/bgelementnew.png')]">
                  {shoppingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleOptionClick(option.id)}
                      className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                        selectedOption === option.id ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={option.image || "/placeholder.svg"}
                          alt={option.alt}
                          className=" object-cover grayscale w-full"
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div> */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className="bg-white/16 border border-white/70 rounded px-3 py-2">
                            <p className="text-primary text-[16px] md:text-[18px] playfairsb text-center">
                              {option.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedOption && (
                  <div className="bg-gray-700 px-6 py-4 text-center">
                    <p className="text-primary">
                      You selected:{" "}
                      <span className="font-semibold text-blue-400">
                        {shoppingOptions.find((opt) => opt.id === selectedOption)?.title}
                      </span>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
