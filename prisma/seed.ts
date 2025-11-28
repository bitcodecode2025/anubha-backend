// prisma/seed.ts
import { PrismaClient, DoctorFieldType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Production-ready seed for Nutriwell DoctorFieldGroup, DoctorFieldMaster, DoctorFieldOption
 * - Matches your Prisma schema and enum names
 * - Recommended settings applied: 1A,2A,3A,4A,5Yes
 * - Idempotent and safe to run multiple times
 */

/* -------------------------
   Helper Definitions
   -------------------------*/

type SeedField = {
  key: string;
  label: string;
  description?: string | null;
  type: DoctorFieldType;
  groupKey: string;
  required?: boolean;
  order?: number;
  placeholder?: string | null;
  // options are only used for SELECT / MULTISELECT / RADIO types
  options?: { value: string; label: string; order?: number }[];
};

const groups = [
  {
    key: "personal_joining",
    title: "SECTION A — Personal & Joining Details",
    order: 0,
  },
  { key: "sleep_timing", title: "SECTION B — Sleep & Daily Timings", order: 1 },
  {
    key: "workout_activity",
    title: "SECTION C — Workout / Activity",
    order: 2,
  },
  { key: "water_intake", title: "SECTION D — Daily Water Intake", order: 3 },
  {
    key: "food_recall_morning",
    title: "SECTION E — 24-Hour Food Recall (Morning)",
    order: 4,
  },
  {
    key: "food_recall_breakfast",
    title: "SECTION E — 24-Hour Food Recall (Breakfast)",
    order: 5,
  },
  {
    key: "food_recall_midmorning",
    title: "SECTION E — 24-Hour Food Recall (Mid-Morning)",
    order: 6,
  },
  { key: "lunch_details", title: "SECTION F — Lunch", order: 7 },
  {
    key: "afternoon_midday",
    title: "SECTION G — Afternoon / Mid-Day",
    order: 8,
  },
  { key: "evening_snacks", title: "SECTION H — Evening Snacks", order: 9 },
  { key: "dinner_details", title: "SECTION I — Dinner", order: 10 },
  { key: "weekend_diet", title: "SECTION J — Weekend Diet", order: 11 },
  { key: "eating_out", title: "SECTION K — Eating Out Habits", order: 12 },
  {
    key: "allergies_intolerance",
    title: "SECTION L — Food Allergies & Intolerance",
    order: 13,
  },
  { key: "eating_behavior", title: "SECTION M — Eating Behaviour", order: 14 },
  { key: "food_preferences", title: "SECTION N — Food Preferences", order: 15 },
  { key: "food_frequency", title: "SECTION O — Food Frequency", order: 16 },
  { key: "health_profile", title: "SECTION P — Health Profile", order: 17 },
];

/* -------------------------
   Common option sets
   -------------------------*/
const yesNo = [
  { value: "yes", label: "Yes", order: 0 },
  { value: "no", label: "No", order: 1 },
];

const rotiTypes = [
  { value: "wheat", label: "Wheat", order: 0 },
  { value: "ragi", label: "Ragi", order: 1 },
  { value: "bajra", label: "Bajra", order: 2 },
  { value: "jowar", label: "Jowar", order: 3 },
  { value: "multigrain", label: "Multigrain", order: 4 },
];

const riceTypes = [
  { value: "white", label: "White", order: 0 },
  { value: "brown", label: "Brown", order: 1 },
  { value: "starch_free", label: "Starch free", order: 2 },
  { value: "usna", label: "USNA", order: 3 },
];

const dietPreference = [
  { value: "veg", label: "Veg", order: 0 },
  { value: "non_veg", label: "Non-Veg", order: 1 },
  { value: "egg_veg", label: "Egg", order: 2 },
];

const waterOptions = [
  { value: "1l", label: "1L", order: 0 },
  { value: "2l", label: "2L", order: 1 },
  { value: "3l", label: "3L", order: 2 },
  { value: "4l", label: "4L", order: 3 },
  { value: "5l_plus", label: "5L+", order: 4 },
];

const workoutTimingOptions = [
  { value: "morning", label: "Morning", order: 0 },
  { value: "afternoon", label: "Afternoon", order: 1 },
  { value: "evening", label: "Evening", order: 2 },
  { value: "night", label: "Night", order: 3 },
];

const sportTypeOptions = [
  { value: "yoga", label: "Yoga", order: 0 },
  { value: "gym", label: "Gym", order: 1 },
  { value: "home", label: "Home-Based", order: 2 },
  { value: "other", label: "Other", order: 3 },
];

const frequencyOptions = [
  { value: "daily", label: "Daily", order: 0 },
  { value: "weekly", label: "Weekly", order: 1 },
  { value: "monthly", label: "Monthly", order: 2 },
  { value: "six_months", label: "6 months", order: 3 },
];

const mainMealOptions = [
  { value: "breakfast", label: "Breakfast", order: 0 },
  { value: "lunch", label: "Lunch", order: 1 },
  { value: "dinner", label: "Dinner", order: 2 },
];

const eaterTypeOptions = [
  { value: "quick", label: "Quick", order: 0 },
  { value: "slow", label: "Slow", order: 1 },
  { value: "moderate", label: "Moderate", order: 2 },
];

const activityDuringMealOptions = [
  { value: "phone", label: "Phone", order: 0 },
  { value: "tv", label: "TV", order: 1 },
  { value: "discussion", label: "Discussion", order: 2 },
  { value: "none", label: "None", order: 3 },
];

const sleepQualityOptions = [
  { value: "NORMAL", label: "Normal", order: 0 },
  { value: "IRREGULAR", label: "Irregular", order: 1 },
  { value: "DISTURBED", label: "Disturbed", order: 2 },
  { value: "INSOMNIA", label: "Insomnia", order: 3 },
];

const physicalActivityOptions = [
  { value: "sedentary", label: "Sedentary", order: 0 },
  { value: "moderate", label: "Moderate", order: 1 },
  { value: "heavy", label: "Heavy", order: 2 },
];

/* -------------------------
   Food frequency items (keys)
   We'll create one text field per item as requested
   -------------------------*/
const foodFrequencyItems = [
  "non_veg",
  "fish",
  "white_meat",
  "red_meat",
  "eggs",
  "milk",
  "curd_buttermilk",
  "noodles",
  "butter_ghee_cream",
  "bread",
  "paneer",
  "cheese",
  "ice_cream",
  "milkshake",
  "chocolate",
  "fried_foods",
  "pickle_papad",
  "biscuits",
  "sweets_desserts",
  "jam_sauces",
  "instant_foods",
  "soft_drinks",
  "oils_used",
  "oil_consumed_month",
  "sugar_honey_jaggery",
  "tea_coffee",
  "smoking",
  "alcohol",
  "tobacco",
  "water",
  "leafy_vegetables",
  "fresh_fruits",
  "dry_fruits_nuts",
  "veg_salads",
  "eating_out_frequency",
  "coconut",
  "pizza_burger",
];

/* -------------------------
   The full field list
   (structured, production-focused)
   -------------------------*/
const baseFields: SeedField[] = [
  // SECTION A — Personal & Joining
  {
    key: "personal_history",
    label: "Personal history",
    type: DoctorFieldType.TEXT,
    groupKey: "personal_joining",
    order: 0,
  },
  {
    key: "joining_date",
    label: "Joining date",
    type: DoctorFieldType.DATE,
    groupKey: "personal_joining",
    order: 1,
  },
  {
    key: "previous_diet_taken",
    label: "Previous diet taken",
    type: DoctorFieldType.RADIO,
    groupKey: "personal_joining",
    options: yesNo,
    order: 2,
  },
  {
    key: "type_of_diet_taken",
    label: "Type of diet taken",
    type: DoctorFieldType.SELECT,
    groupKey: "personal_joining",
    options: [
      { value: "by_expert", label: "By Expert", order: 0 },
      { value: "by_google", label: "By Google", order: 1 },
      { value: "other", label: "Other", order: 2 },
    ],
    order: 3,
  },
  {
    key: "previous_diet_details",
    label: "If yes, details",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "personal_joining",
    order: 4,
  },
  {
    key: "marital_status",
    label: "Marital status",
    type: DoctorFieldType.SELECT,
    groupKey: "personal_joining",
    options: [
      { value: "married", label: "Married", order: 0 },
      { value: "unmarried", label: "Unmarried", order: 1 },
    ],
    order: 5,
  },
  {
    key: "number_of_children",
    label: "Number of children",
    type: DoctorFieldType.NUMBER,
    groupKey: "personal_joining",
    order: 6,
  },
  {
    key: "reason_for_joining",
    label: "Reason for joining program",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "personal_joining",
    order: 7,
  },
  {
    key: "ethnicity",
    label: "Ethnicity",
    type: DoctorFieldType.TEXT,
    groupKey: "personal_joining",
    order: 8,
  },
  {
    key: "diet_preference",
    label: "Diet preference",
    type: DoctorFieldType.SELECT,
    groupKey: "personal_joining",
    options: dietPreference,
    order: 9,
  },
  {
    key: "non_veg_type",
    label: "Non-veg type",
    type: DoctorFieldType.TEXT,
    groupKey: "personal_joining",
    order: 10,
  },

  // SECTION B — Sleep & Daily Timings
  {
    key: "sleeping_hours_timing",
    label: "Sleeping hours & timing",
    type: DoctorFieldType.TEXT,
    groupKey: "sleep_timing",
    order: 0,
  },
  {
    key: "wake_up_time",
    label: "Wake-up time",
    type: DoctorFieldType.TIME,
    groupKey: "sleep_timing",
    order: 1,
  },
  {
    key: "bed_time",
    label: "Bed time",
    type: DoctorFieldType.TIME,
    groupKey: "sleep_timing",
    order: 2,
  },
  {
    key: "day_nap",
    label: "Day nap (yes/no + duration)",
    type: DoctorFieldType.TEXT,
    groupKey: "sleep_timing",
    order: 3,
  },

  // SECTION C — Workout / Activity
  {
    key: "workout_timing",
    label: "Workout timing",
    type: DoctorFieldType.SELECT,
    groupKey: "workout_activity",
    options: workoutTimingOptions,
    order: 0,
  },
  {
    key: "sport_type",
    label: "Sport type",
    type: DoctorFieldType.SELECT,
    groupKey: "workout_activity",
    options: sportTypeOptions,
    order: 1,
  },

  // SECTION D — Daily Water Intake
  {
    key: "daily_water_intake",
    label: "Daily water intake",
    type: DoctorFieldType.SELECT,
    groupKey: "water_intake",
    options: waterOptions,
    order: 0,
  },

  // SECTION E — Morning Intake (discrete fields)
  {
    key: "morning_water",
    label: "Water (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 0,
  },
  {
    key: "morning_medicine",
    label: "Medicine (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 1,
  },
  {
    key: "morning_tea_coffee",
    label: "Tea/Coffee (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 2,
  },
  {
    key: "morning_lemon_water",
    label: "Lemon water (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 3,
  },
  {
    key: "morning_garlic_herbs",
    label: "Garlic/Herbs (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 4,
  },
  {
    key: "morning_soaked_dry_fruits",
    label: "Soaked dry fruits (morning)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_morning",
    options: yesNo,
    order: 5,
  },
  {
    key: "morning_fruit_type_qty",
    label: "Fruit type + quantity (morning)",
    type: DoctorFieldType.TEXT,
    groupKey: "food_recall_morning",
    order: 6,
  },
  {
    key: "morning_biscuits_toast",
    label: "Biscuits/Toast type + quantity (morning)",
    type: DoctorFieldType.TEXT,
    groupKey: "food_recall_morning",
    order: 7,
  },

  // SECTION E — Breakfast items (individual quantity fields)
  {
    key: "breakfast_poha_qty",
    label: "Poha (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 0,
  },
  {
    key: "breakfast_upma_qty",
    label: "Upma (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 1,
  },
  {
    key: "breakfast_paratha_qty",
    label: "Paratha (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 2,
  },
  {
    key: "breakfast_stuffed_paratha_qty",
    label: "Stuffed Paratha (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 3,
  },
  {
    key: "breakfast_poori_qty",
    label: "Poori (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 4,
  },
  {
    key: "breakfast_roti_ghee_qty",
    label: "Roti (Ghee) (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 5,
  },
  {
    key: "breakfast_roti_without_ghee_qty",
    label: "Roti (Without Ghee) (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 6,
  },
  {
    key: "breakfast_idly_dosa_qty",
    label: "Idly / Dosa (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 7,
  },
  {
    key: "breakfast_sandwich_qty",
    label: "Sandwich (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 8,
  },
  {
    key: "breakfast_eggs_qty",
    label: "Eggs (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 9,
  },
  {
    key: "breakfast_juice_qty",
    label: "Juice (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 10,
  },
  {
    key: "breakfast_fruits_qty",
    label: "Fruits (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 11,
  },
  {
    key: "breakfast_milk_qty",
    label: "Milk (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "food_recall_breakfast",
    order: 12,
  },

  // SECTION E — Mid-Morning
  {
    key: "mid_buttermilk",
    label: "Buttermilk (mid)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_midmorning",
    options: yesNo,
    order: 0,
  },
  {
    key: "mid_curd",
    label: "Curd (mid)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_midmorning",
    options: yesNo,
    order: 1,
  },
  {
    key: "mid_fruits",
    label: "Fruits (mid)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_midmorning",
    options: yesNo,
    order: 2,
  },
  {
    key: "mid_tea_coffee",
    label: "Tea/Coffee (mid)",
    type: DoctorFieldType.RADIO,
    groupKey: "food_recall_midmorning",
    options: yesNo,
    order: 3,
  },
  {
    key: "mid_other_snacks",
    label: "Other snacks (mid)",
    type: DoctorFieldType.TEXT,
    groupKey: "food_recall_midmorning",
    order: 4,
  },

  // SECTION F — Lunch (structured fields)
  // Bowl sizes — use SELECT with 1..5 options
  {
    key: "lunch_rice_bowl",
    label: "Rice bowl (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 0,
  },
  {
    key: "lunch_dal_bowl",
    label: "Dal bowl (type + qty)",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 1,
  },
  {
    key: "lunch_veg_bowl",
    label: "Vegetable bowl (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 2,
  },
  {
    key: "lunch_sambar_bowl",
    label: "Sambar bowl (qty)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 3,
  },
  {
    key: "lunch_curd_kadhi_bowl",
    label: "Curd/Kadhi bowl (qty)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 4,
  },
  {
    key: "lunch_beans_type_qty",
    label: "Beans (type + qty)",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 5,
  },
  {
    key: "lunch_chicken_qty",
    label: "Chicken qty",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 6,
  },
  {
    key: "lunch_fish_qty",
    label: "Fish qty",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 7,
  },
  {
    key: "lunch_mutton_qty",
    label: "Mutton qty",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 8,
  },
  {
    key: "lunch_seafood_qty",
    label: "Seafood qty",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 9,
  },
  {
    key: "lunch_pickles",
    label: "Pickle (yes/no)",
    type: DoctorFieldType.RADIO,
    groupKey: "lunch_details",
    options: yesNo,
    order: 10,
  },
  {
    key: "lunch_papad_count",
    label: "Papad (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 11,
  },
  {
    key: "lunch_pulao_bowl",
    label: "Pulao bowl (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "lunch_details",
    order: 12,
  },
  {
    key: "lunch_khichdi_bowl",
    label: "Khichdi bowl (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "lunch_details",
    order: 13,
  },
  {
    key: "lunch_biryani_bowl",
    label: "Biryani bowl (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "lunch_details",
    order: 14,
  },
  {
    key: "lunch_salad_bowl",
    label: "Salad type & bowl",
    type: DoctorFieldType.TEXT,
    groupKey: "lunch_details",
    order: 15,
  },
  {
    key: "lunch_roti_count",
    label: "Roti count (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 16,
  },
  {
    key: "lunch_roti_type",
    label: "Roti type",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: rotiTypes,
    order: 17,
  },
  {
    key: "lunch_rice_type",
    label: "Rice type",
    type: DoctorFieldType.SELECT,
    groupKey: "lunch_details",
    options: riceTypes,
    order: 18,
  },

  // SECTION G — Afternoon / Mid-Day
  {
    key: "midday_sweets_type",
    label: "Sweets (type)",
    type: DoctorFieldType.TEXT,
    groupKey: "afternoon_midday",
    order: 0,
  },
  {
    key: "midday_sweets_bowl",
    label: "Sweets (bowl 1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "afternoon_midday",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 1,
  },
  {
    key: "midday_desserts",
    label: "Desserts (type)",
    type: DoctorFieldType.TEXT,
    groupKey: "afternoon_midday",
    order: 2,
  },
  {
    key: "midday_laddus",
    label: "Laddus (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "afternoon_midday",
    order: 3,
  },
  {
    key: "midday_fruits",
    label: "Fruits (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "afternoon_midday",
    order: 4,
  },

  // SECTION H — Evening Snacks
  {
    key: "evening_biscuits_toast_qty",
    label: "Biscuits / Toast (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 0,
  },
  {
    key: "evening_namkeen_qty",
    label: "Namkeen (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 1,
  },
  {
    key: "evening_poha_qty",
    label: "Poha (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 2,
  },
  {
    key: "evening_upma_qty",
    label: "Upma (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 3,
  },
  {
    key: "evening_sandwich_qty",
    label: "Sandwich (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 4,
  },
  {
    key: "evening_dosa_qty",
    label: "Dosa (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 5,
  },
  {
    key: "evening_chana_qty",
    label: "Chana (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 6,
  },
  {
    key: "evening_makhana_qty",
    label: "Makhana (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 7,
  },
  {
    key: "evening_groundnuts_qty",
    label: "Groundnuts (qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 8,
  },
  {
    key: "evening_tea_coffee",
    label: "Tea/Coffee (evening)",
    type: DoctorFieldType.RADIO,
    groupKey: "evening_snacks",
    options: yesNo,
    order: 9,
  },
  {
    key: "evening_milk_qty",
    label: "Milk (evening qty)",
    type: DoctorFieldType.NUMBER,
    groupKey: "evening_snacks",
    order: 10,
  },

  // SECTION I — Dinner
  {
    key: "dinner_rice_bowl",
    label: "Dinner Rice bowl (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 0,
  },
  {
    key: "dinner_dal_bowl",
    label: "Dinner Dal bowl (type + qty)",
    type: DoctorFieldType.TEXT,
    groupKey: "dinner_details",
    order: 1,
  },
  {
    key: "dinner_veg_bowl",
    label: "Dinner Vegetable bowl (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 2,
  },
  {
    key: "dinner_sambar_bowl",
    label: "Dinner Sambar bowl (qty)",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 3,
  },
  {
    key: "dinner_curd_kadhi",
    label: "Dinner Curd/Kadhi bowl (qty)",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 4,
  },
  {
    key: "dinner_chicken_qty",
    label: "Dinner Chicken qty",
    type: DoctorFieldType.TEXT,
    groupKey: "dinner_details",
    order: 5,
  },
  {
    key: "dinner_fish_qty",
    label: "Dinner Fish qty",
    type: DoctorFieldType.TEXT,
    groupKey: "dinner_details",
    order: 6,
  },
  {
    key: "dinner_mutton_qty",
    label: "Dinner Mutton qty",
    type: DoctorFieldType.TEXT,
    groupKey: "dinner_details",
    order: 7,
  },
  {
    key: "dinner_seafood_qty",
    label: "Dinner Seafood qty",
    type: DoctorFieldType.TEXT,
    groupKey: "dinner_details",
    order: 8,
  },
  {
    key: "dinner_roti_count",
    label: "Dinner Roti count (1-5)",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: [
      { value: "1", label: "1", order: 0 },
      { value: "2", label: "2", order: 1 },
      { value: "3", label: "3", order: 2 },
      { value: "4", label: "4", order: 3 },
      { value: "5", label: "5", order: 4 },
    ],
    order: 9,
  },
  {
    key: "dinner_roti_type",
    label: "Dinner Roti type",
    type: DoctorFieldType.SELECT,
    groupKey: "dinner_details",
    options: rotiTypes,
    order: 10,
  },

  // SECTION J — Weekend Diet
  {
    key: "weekend_food_details",
    label: "Weekend food details",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "weekend_diet",
    order: 0,
  },
  {
    key: "weekend_changes",
    label: "Changes (weekend)",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "weekend_diet",
    order: 1,
  },
  {
    key: "weekend_snack_starter_main",
    label: "Snack/Starter/Main course (weekend)",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "weekend_diet",
    order: 2,
  },

  // SECTION K — Eating Out
  {
    key: "eating_out_frequency",
    label: "Eating out frequency",
    type: DoctorFieldType.SELECT,
    groupKey: "eating_out",
    options: frequencyOptions,
    order: 0,
  },
  {
    key: "eating_out_items",
    label: "Eating out - food items",
    type: DoctorFieldType.TEXT,
    groupKey: "eating_out",
    order: 1,
  },
  {
    key: "eating_out_quantity",
    label: "Eating out - quantity",
    type: DoctorFieldType.TEXT,
    groupKey: "eating_out",
    order: 2,
  },

  // SECTION L — Allergies & Intolerance
  {
    key: "has_food_allergies",
    label: "Food allergies",
    type: DoctorFieldType.RADIO,
    groupKey: "allergies_intolerance",
    options: yesNo,
    order: 0,
  },
  {
    key: "has_food_intolerance",
    label: "Food intolerance",
    type: DoctorFieldType.RADIO,
    groupKey: "allergies_intolerance",
    options: yesNo,
    order: 1,
  },
  {
    key: "allergy_types",
    label: "If yes — specify",
    type: DoctorFieldType.MULTISELECT,
    groupKey: "allergies_intolerance",
    options: [
      { value: "soy", label: "Soy", order: 0 },
      { value: "gluten", label: "Gluten", order: 1 },
      { value: "lactose", label: "Lactose", order: 2 },
      { value: "citrus", label: "Citrus", order: 3 },
      { value: "egg", label: "Egg", order: 4 },
      { value: "milk", label: "Milk", order: 5 },
      { value: "curd", label: "Curd", order: 6 },
      { value: "other", label: "Other", order: 7 },
    ],
    order: 2,
  },

  // SECTION M — Eating Behaviour
  {
    key: "type_of_eater",
    label: "Type of eater",
    type: DoctorFieldType.SELECT,
    groupKey: "eating_behavior",
    options: eaterTypeOptions,
    order: 0,
  },
  {
    key: "activity_during_meals",
    label: "Activity during meals",
    type: DoctorFieldType.SELECT,
    groupKey: "eating_behavior",
    options: activityDuringMealOptions,
    order: 1,
  },
  {
    key: "hunger_pangs",
    label: "Hunger pangs (yes/no + time)",
    type: DoctorFieldType.TEXT,
    groupKey: "eating_behavior",
    order: 2,
  },
  {
    key: "emotional_eating",
    label: "Emotional eating (yes/no + description)",
    type: DoctorFieldType.TEXT,
    groupKey: "eating_behavior",
    order: 3,
  },
  {
    key: "main_meal",
    label: "Main meal",
    type: DoctorFieldType.SELECT,
    groupKey: "eating_behavior",
    options: mainMealOptions,
    order: 4,
  },
  {
    key: "snacks_you_crave",
    label: "Snacks you crave",
    type: DoctorFieldType.TEXT,
    groupKey: "eating_behavior",
    order: 5,
  },
  {
    key: "sweet_cravings",
    label: "Sweet cravings",
    type: DoctorFieldType.RADIO,
    groupKey: "eating_behavior",
    options: yesNo,
    order: 6,
  },

  // SECTION N — Food Preferences
  {
    key: "likes_food_list",
    label: "Likes (food list)",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "food_preferences",
    order: 0,
  },
  {
    key: "dislikes_food_list",
    label: "Dislikes (food list)",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "food_preferences",
    order: 1,
  },
  {
    key: "fasting",
    label: "Fasting (Yes/No + frequency)",
    type: DoctorFieldType.TEXT,
    groupKey: "food_preferences",
    order: 2,
  },

  // SECTION O — Food Frequency (text per item)
  ...foodFrequencyItems.map((id, idx) => ({
    key: `freq_${id}`,
    label: `${id.replace(/_/g, " ")} (quantity + frequency + prep)`,
    type: DoctorFieldType.TEXT,
    groupKey: "food_frequency",
    order: idx,
  })),

  // SECTION P — Health Profile
  {
    key: "physical_activity_level",
    label: "Physical activity level",
    type: DoctorFieldType.SELECT,
    groupKey: "health_profile",
    options: physicalActivityOptions,
    order: 0,
  },
  {
    key: "sleep_quality",
    label: "Sleep",
    type: DoctorFieldType.SELECT,
    groupKey: "health_profile",
    options: sleepQualityOptions,
    order: 1,
  },
  {
    key: "insomnia_history",
    label: "Insomnia history",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 2,
  },
  {
    key: "high_bp",
    label: "High BP",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 3,
  },
  {
    key: "diabetes",
    label: "Diabetes",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 4,
  },
  {
    key: "cholesterol",
    label: "Cholesterol",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 5,
  },
  {
    key: "obesity",
    label: "Obesity",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 6,
  },
  {
    key: "family_history",
    label: "Family history (Father / Mother / Sibling)",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 7,
  },
  {
    key: "cardiac_risk",
    label: "Cardiac risk",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 8,
  },
  {
    key: "heart_problem",
    label: "Heart problem",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 9,
  },
  {
    key: "musculoskeletal_pain",
    label: "Back/Neck/Knee/Shoulder pain",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 10,
  },
  {
    key: "respiratory_problems",
    label: "Respiratory problems (Asthma/Breathlessness)",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 11,
  },
  {
    key: "post_operational",
    label: "Post-operative",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 12,
  },
  {
    key: "hormonal_issues",
    label: "Hormonal: Thyroid / PCOD / PCOS",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 13,
  },
  {
    key: "gynec_problems",
    label: "Gynec problems",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 14,
  },
  {
    key: "gastric_problems",
    label: "Gastric problems: Acidity / Constipation",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 15,
  },
  {
    key: "other_allergies",
    label: "Other allergies",
    type: DoctorFieldType.TEXT,
    groupKey: "health_profile",
    order: 16,
  },
  {
    key: "medications",
    label: "Medications (name + reason + timing + quantity)",
    type: DoctorFieldType.TEXTAREA,
    groupKey: "health_profile",
    order: 17,
  },
  {
    key: "water_retention",
    label: "Water retention",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 18,
  },
  {
    key: "pregnancy_planning",
    label: "Pregnancy / Planning",
    type: DoctorFieldType.RADIO,
    groupKey: "health_profile",
    options: yesNo,
    order: 19,
  },
];

/* -------------------------
   Upsert logic
   -------------------------*/

async function createGroups() {
  const map: Record<string, { id: string }> = {};
  for (const g of groups) {
    const upserted = await prisma.doctorFieldGroup.upsert({
      where: { key: g.key },
      update: { title: g.title, order: g.order, updatedAt: new Date() },
      create: { key: g.key, title: g.title, order: g.order },
    });
    map[g.key] = { id: upserted.id };
  }
  return map;
}

async function upsertFieldAndOptions(
  f: SeedField,
  groupMap: Record<string, { id: string }>
) {
  const group = groupMap[f.groupKey];
  if (!group) {
    console.warn("Missing group for", f.key, f.groupKey);
    return;
  }

  const upserted = await prisma.doctorFieldMaster.upsert({
    where: { key: f.key },
    update: {
      label: f.label,
      description: f.description ?? null,
      placeholder: f.placeholder ?? null,
      required: f.required ?? false,
      order: f.order ?? 0,
      type: f.type,
      groupId: group.id,
      active: true,
      updatedAt: new Date(),
    },
    create: {
      key: f.key,
      label: f.label,
      description: f.description ?? null,
      placeholder: f.placeholder ?? null,
      required: f.required ?? false,
      order: f.order ?? 0,
      type: f.type,
      group: { connect: { id: group.id } },
      active: true,
    },
  });

  // If field has options, upsert them (per-field)
  if (f.options && f.options.length > 0) {
    for (const opt of f.options) {
      await prisma.doctorFieldOption.upsert({
        where: { fieldId_value: { fieldId: upserted.id, value: opt.value } },
        update: {
          label: opt.label,
          order: opt.order ?? 0,
          updatedAt: new Date(),
        },
        create: {
          fieldId: upserted.id,
          value: opt.value,
          label: opt.label,
          order: opt.order ?? 0,
        },
      });
    }
  }
  return upserted;
}

async function main() {
  try {
    console.log("Starting seed: Creating groups...");
    const groupMap = await createGroups();
    console.log("Groups created:", Object.keys(groupMap).length);

    console.log("Upserting fields...");
    for (const f of baseFields) {
      // ensure type is correct (already DoctorFieldType)
      await upsertFieldAndOptions(f, groupMap);
    }

    // Summary
    const totalGroups = await prisma.doctorFieldGroup.count();
    const totalFields = await prisma.doctorFieldMaster.count();
    const totalOptions = await prisma.doctorFieldOption.count();
    console.log("Seeding finished.");
    console.log({ totalGroups, totalFields, totalOptions });
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
