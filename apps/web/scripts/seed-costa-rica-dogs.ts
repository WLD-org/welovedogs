import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(__dirname, "../../..");
const IMAGES_DIR = path.resolve(__dirname, "../public/images/dogs");

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, ".env"));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or key in environment");
}

const supabase = createClient(supabaseUrl, supabaseKey);

type DogSeed = {
  slug: string;
  name: string;
  providerEmail: string;
  story: string;
  currentCondition: string;
  headline: string;
  needsSurgery: boolean;
  medicalTreatment: boolean;
  medicalRecovery: boolean;
  readyForAdoption: boolean;
  isEmergency: boolean;
  emergencyExplanation?: string;
  goal: number;
  fundsNeededFor: string[];
};

const DOGS: DogSeed[] = [
  {
    slug: "alex",
    name: "Alex",
    providerEmail: "info@territoriodezaguates.com",
    headline: "Alex is learning what safety feels like",
    currentCondition:
      "Recovering from early abandonment; still shy but slowly building trust with caregivers.",
    story:
      "A gentle soul with tiger-striped fur and eyes that still ask if humans can be trusted again. Alex was rescued after being abandoned at a very young age, scared and malnourished, hiding from the world instead of exploring it like a puppy should.\n\nToday, he is slowly learning what safety feels like: soft blankets, warm meals, and people who care. He still gets shy sometimes, but every small tail wag is a reminder that healing is possible.\n\nYour donation helps Alex continue his recovery journey with food, vaccines, medical care, and a chance to finally grow up in a loving home instead of on the streets.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 450,
    fundsNeededFor: ["Vaccination", "Food", "Medication"],
  },
  {
    slug: "cami",
    name: "Cami",
    providerEmail: "contact@crdogrescue.com",
    headline: "Cami still smiles through every step of recovery",
    currentCondition:
      "Receiving medical attention, nutrition, and emotional rehabilitation after unsafe living conditions.",
    story:
      "Cami arrived at the clinic terrified but still somehow smiling. Despite everything she had been through, she greeted everyone with bright eyes and a hopeful little grin that melted hearts instantly.\n\nShe was rescued from unsafe conditions where she had little protection or proper care. Now she is receiving medical attention, nutrition, and love for the first time in a long while.\n\nCami is the kind of dog who reminds you that resilience exists. Donations for her campaign go directly toward veterinary care, sterilization, recovery, and helping her find the forever family she deserves.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 520,
    fundsNeededFor: ["Emergency Care", "Spay/Neuter", "Food"],
  },
  {
    slug: "candy",
    name: "Candy",
    providerEmail: "nicole@guayaboanimalrescue.org",
    headline: "Candy chooses joy every single day",
    currentCondition:
      "In rehabilitation after neglect; affectionate, social, and responding well to structured care.",
    story:
      "Candy has one of those smiles that makes people stop in their tracks. But behind that happy face is a story of neglect and survival. She spent much of her life without stability, affection, or safety.\n\nEven after everything, Candy remains incredibly affectionate and social. She loves human attention, enjoys being around other dogs, and still chooses joy every single day.\n\nYour support helps provide her with medical treatment, shelter, food, and rehabilitation while we search for the home she has always deserved.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 480,
    fundsNeededFor: ["Medical Care", "Shelter / Housing", "Food"],
  },
  {
    slug: "carlos",
    name: "Carlos",
    providerEmail: "contact@hope4astreetdog.org",
    headline: "Carlos is finding courage one step at a time",
    currentCondition:
      "Cautious but improving; needs vaccinations, nutrition, and gentle socialization.",
    story:
      "Carlos is a tiny warrior with enormous ears and even bigger courage. He was rescued while wandering alone, confused and vulnerable, trying to survive in dangerous conditions.\n\nAt first, he was extremely cautious around people, but little by little he has started opening his heart again. Now he follows volunteers around quietly, searching for comfort and connection.\n\nEvery donation helps Carlos continue receiving food, vaccinations, care, and emotional rehabilitation while we prepare him for adoption into a safe and loving family.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 380,
    fundsNeededFor: ["Vaccination", "Food", "Rehabilitation / Training"],
  },
  {
    slug: "cata",
    name: "Cata",
    providerEmail: "info@animalesdeasis.com",
    headline: "Cata is learning to trust again",
    currentCondition:
      "Gentle and calm; gaining confidence daily while receiving steady rescue care.",
    story:
      "Cata's story is one of quiet survival. She spent her early life without stability, often overlooked and struggling to find safety. But despite her difficult beginning, she remains incredibly sweet and gentle.\n\nShe loves calm spaces, soft beds, and the simple feeling of being protected. Every day she becomes a little more confident, a little more playful, and a little more trusting.\n\nYour support helps cover her veterinary expenses, nutrition, and rescue care while she waits for the second chance she truly deserves.",
    needsSurgery: false,
    medicalTreatment: false,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 420,
    fundsNeededFor: ["Food", "Vaccination", "Shelter / Housing"],
  },
  {
    slug: "chimichurri",
    name: "Chimichurri",
    providerEmail: "charlies.angels.costarica@gmail.com",
    headline: "Chimichurri is discovering that life can be safe",
    currentCondition:
      "Recovering from abandonment; affectionate once comfortable and needs ongoing medical follow-up.",
    story:
      "Chimichurri may be small, but her personality fills every room she enters. Rescued from abandonment, she arrived frightened and exhausted, unsure if humans would help her or hurt her.\n\nNow she spends her days cuddled in blankets, slowly discovering that life can be safe and peaceful. She is affectionate, curious, and incredibly loving once she feels comfortable.\n\nDonations help provide her with medical care, daily food, sterilization, and a path toward finding a forever family that will never abandon her again.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 400,
    fundsNeededFor: ["Spay/Neuter", "Medication", "Food"],
  },
  {
    slug: "cleme",
    name: "Cleme",
    providerEmail: "info@ahppa.com",
    headline: "Cleme keeps healing with hopeful eyes",
    currentCondition:
      "Recovering from serious medical complications; requires ongoing treatment and monitoring.",
    story:
      "Cleme's journey has been painful. She was rescued while wearing a recovery cone after suffering medical complications that could have easily become life-threatening without intervention.\n\nEven through discomfort and fear, Cleme never stopped trying to connect with people. She still greets rescuers with hopeful eyes and gentle affection, showing incredible emotional strength.\n\nYour contribution helps fund her ongoing treatment, medications, recovery process, and the safe environment she needs to heal both physically and emotionally.",
    needsSurgery: true,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 650,
    fundsNeededFor: ["Surgery", "Medication", "Emergency Care"],
  },
  {
    slug: "cocoa",
    name: "Cocoa",
    providerEmail: "contact@halfwayhometamarindo.com",
    headline: "Cocoa is rebuilding trust after severe injury",
    currentCondition:
      "Long-term rehabilitation after severe injury; improving slowly with intensive care.",
    story:
      "Cocoa knows what it feels like to suffer in silence. When she was rescued, she was severely injured and exhausted, needing urgent medical attention and intensive care.\n\nHer recovery has been long, but her spirit never gave up. Slowly, she has started trusting again, enjoying affection, rest, and moments of peace she likely never experienced before rescue.\n\nDonations to Cocoa's campaign directly support her rehabilitation, medical treatments, pain management, nutrition, and continued recovery journey.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: true,
    emergencyExplanation:
      "Cocoa arrived with severe injuries requiring urgent and ongoing intensive medical care.",
    goal: 780,
    fundsNeededFor: ["Emergency Care", "Medication", "Rehabilitation / Training"],
  },
  {
    slug: "mulan",
    name: "Mulan",
    providerEmail: "contact@elrefugiocostaballena.com",
    headline: "Mulan is fighting her way back to strength",
    currentCondition:
      "Stabilizing after serious injury; needs daily veterinary support and recovery monitoring.",
    story:
      "Mulan arrived weak, injured, and emotionally drained after enduring extremely difficult conditions. She required immediate medical support and constant monitoring just to stabilize.\n\nBut even during recovery, Mulan showed remarkable strength. Every small improvement became a huge victory: standing up, eating again, relaxing beside caregivers, and finally feeling safe enough to sleep peacefully.\n\nYour support helps cover her ongoing veterinary treatment, recovery supplies, medications, and the loving care she still needs every day.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: true,
    emergencyExplanation:
      "Mulan needed immediate stabilization and continues to require close medical monitoring.",
    goal: 720,
    fundsNeededFor: ["Emergency Care", "Medication", "Shelter / Housing"],
  },
  {
    slug: "ramona",
    name: "Ramona",
    providerEmail: "nordicosdecostarica@gmail.com",
    headline: "Ramona brings joy wherever she goes",
    currentCondition:
      "Healthy and playful; preparing for adoption with routine veterinary care and sterilization.",
    story:
      "Ramona is pure happiness wrapped in a wagging tail. Despite having a difficult start in life, she still greets the world with excitement, affection, and endless love for people.\n\nShe was rescued after spending time vulnerable and unprotected, but her joyful personality never disappeared. Ramona quickly became a favorite among volunteers thanks to her playful and loving energy.\n\nDonations help provide her with food, veterinary care, vaccinations, sterilization, and support while she waits for a family to finally call her own.",
    needsSurgery: false,
    medicalTreatment: true,
    medicalRecovery: false,
    readyForAdoption: true,
    isEmergency: false,
    goal: 360,
    fundsNeededFor: ["Vaccination", "Spay/Neuter", "Food"],
  },
  {
    slug: "spencer",
    name: "Spencer",
    providerEmail: "info@territoriodezaguates.com",
    headline: "Spencer is learning that he is safe now",
    currentCondition:
      "Shy but loyal; progressing through emotional rehabilitation and basic medical care.",
    story:
      "Spencer's eyes tell a story of survival. He was rescued after enduring abandonment and uncertainty, spending too much time without proper care or safety.\n\nAlthough shy at first, Spencer has slowly started showing his sweet and loyal personality. He enjoys calm affection, safe spaces, and being close to people who make him feel protected.\n\nYour donation helps Spencer receive the care, rehabilitation, and stability he needs while we work toward finding him the loving forever home he deserves.",
    needsSurgery: false,
    medicalTreatment: false,
    medicalRecovery: true,
    readyForAdoption: false,
    isEmergency: false,
    goal: 430,
    fundsNeededFor: ["Rehabilitation / Training", "Food", "Shelter / Housing"],
  },
];

async function uploadImage(slug: string) {
  const filePath = path.join(IMAGES_DIR, `${slug}.png`);
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `seed/${slug}.png`;

  const { error } = await supabase.storage.from("dog-images").upload(storagePath, fileBuffer, {
    contentType: "image/png",
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload ${slug}: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("dog-images").getPublicUrl(storagePath);

  return publicUrl;
}

async function main() {
  const uploadOnly = process.argv.includes("--upload-only");
  console.log(`Seeding ${DOGS.length} Costa Rica dogs...`);

  for (const dog of DOGS) {
    const imageUrl = await uploadImage(dog.slug);
    if (uploadOnly) {
      console.log(`Uploaded ${dog.name}: ${imageUrl}`);
      continue;
    }

    const { data: provider, error: providerError } = await supabase
      .from("care_providers")
      .select("id, type, city, state, country, location")
      .eq("email", dog.providerEmail)
      .single();

    if (providerError || !provider) {
      throw new Error(`Care provider not found for ${dog.name}: ${dog.providerEmail}`);
    }

    const requesterType =
      provider.type.charAt(0).toUpperCase() + provider.type.slice(1);

    const { data: existingDog } = await supabase
      .from("dogs")
      .select("id")
      .eq("care_provider_id", provider.id)
      .eq("name", dog.name)
      .maybeSingle();

    if (existingDog) {
      console.log(`Skipping ${dog.name} — already exists`);
      continue;
    }

    const location =
      provider.location ||
      `${provider.city ?? "Costa Rica"}, ${provider.state ?? ""}, ${provider.country ?? "Costa Rica"}`.replace(
        ", ,",
        ","
      );

    const { data: insertedDog, error: dogError } = await supabase
      .from("dogs")
      .insert({
        care_provider_id: provider.id,
        name: dog.name,
        story: dog.story,
        current_condition: dog.currentCondition,
        location,
        city: provider.city,
        state: provider.state,
        country: provider.country,
        images: [imageUrl],
        is_emergency: dog.isEmergency,
        emergency_explanation: dog.emergencyExplanation ?? null,
        needs_surgery: dog.needsSurgery,
        medical_treatment: dog.medicalTreatment,
        medical_recovery: dog.medicalRecovery,
        ready_for_adoption: dog.readyForAdoption,
        requester_type: requesterType,
        headline: dog.headline,
      })
      .select("id")
      .single();

    if (dogError || !insertedDog) {
      throw new Error(`Failed to insert ${dog.name}: ${dogError?.message}`);
    }

    const { error: campaignError } = await supabase.from("campaigns").insert({
      dog_id: insertedDog.id,
      care_provider_id: provider.id,
      dog_name: dog.name,
      dog_image: imageUrl,
      headline: dog.headline,
      current_condition: dog.currentCondition,
      funds_needed_for: dog.fundsNeededFor,
      goal: dog.goal,
      raised: 0,
      spent: 0,
      status: "Active",
    });

    if (campaignError) {
      throw new Error(`Failed to create campaign for ${dog.name}: ${campaignError.message}`);
    }

    await supabase
      .from("care_providers")
      .update({ dogs_helped: DOGS.filter((d) => d.providerEmail === dog.providerEmail).length })
      .eq("id", provider.id);

    console.log(`Seeded ${dog.name} at ${dog.providerEmail}`);
  }

  if (uploadOnly) {
    console.log("Upload complete.");
    return;
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
