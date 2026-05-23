-- Seed Costa Rica rescue dogs and active campaigns for seeded care providers.

DO $$
DECLARE
  rec RECORD;
  provider_id UUID;
  dog_id UUID;
BEGIN
  FOR rec IN
    SELECT *
    FROM (
      VALUES
        (
          'Alex'::text,
          'info@territoriodezaguates.com',
          'alex.png',
          'Alex is learning what safety feels like',
          'Recovering from early abandonment; still shy but slowly building trust with caregivers.',
          $story$A gentle soul with tiger-striped fur and eyes that still ask if humans can be trusted again. Alex was rescued after being abandoned at a very young age, scared and malnourished, hiding from the world instead of exploring it like a puppy should.

Today, he is slowly learning what safety feels like: soft blankets, warm meals, and people who care. He still gets shy sometimes, but every small tail wag is a reminder that healing is possible.

Your donation helps Alex continue his recovery journey with food, vaccines, medical care, and a chance to finally grow up in a loving home instead of on the streets.$story$,
          false, true, true, false, false, NULL::text, 450::numeric,
          '["Vaccination", "Food", "Medication"]'::jsonb
        ),
        (
          'Cami',
          'contact@crdogrescue.com',
          'cami.png',
          'Cami still smiles through every step of recovery',
          'Receiving medical attention, nutrition, and emotional rehabilitation after unsafe living conditions.',
          $story$Cami arrived at the clinic terrified but still somehow smiling. Despite everything she had been through, she greeted everyone with bright eyes and a hopeful little grin that melted hearts instantly.

She was rescued from unsafe conditions where she had little protection or proper care. Now she is receiving medical attention, nutrition, and love for the first time in a long while.

Cami is the kind of dog who reminds you that resilience exists. Donations for her campaign go directly toward veterinary care, sterilization, recovery, and helping her find the forever family she deserves.$story$,
          false, true, true, false, false, NULL, 520,
          '["Emergency Care", "Spay/Neuter", "Food"]'::jsonb
        ),
        (
          'Candy',
          'nicole@guayaboanimalrescue.org',
          'candy.png',
          'Candy chooses joy every single day',
          'In rehabilitation after neglect; affectionate, social, and responding well to structured care.',
          $story$Candy has one of those smiles that makes people stop in their tracks. But behind that happy face is a story of neglect and survival. She spent much of her life without stability, affection, or safety.

Even after everything, Candy remains incredibly affectionate and social. She loves human attention, enjoys being around other dogs, and still chooses joy every single day.

Your support helps provide her with medical treatment, shelter, food, and rehabilitation while we search for the home she has always deserved.$story$,
          false, true, true, false, false, NULL, 480,
          '["Medical Care", "Shelter / Housing", "Food"]'::jsonb
        ),
        (
          'Carlos',
          'contact@hope4astreetdog.org',
          'carlos.png',
          'Carlos is finding courage one step at a time',
          'Cautious but improving; needs vaccinations, nutrition, and gentle socialization.',
          $story$Carlos is a tiny warrior with enormous ears and even bigger courage. He was rescued while wandering alone, confused and vulnerable, trying to survive in dangerous conditions.

At first, he was extremely cautious around people, but little by little he has started opening his heart again. Now he follows volunteers around quietly, searching for comfort and connection.

Every donation helps Carlos continue receiving food, vaccinations, care, and emotional rehabilitation while we prepare him for adoption into a safe and loving family.$story$,
          false, true, true, false, false, NULL, 380,
          '["Vaccination", "Food", "Rehabilitation / Training"]'::jsonb
        ),
        (
          'Cata',
          'info@animalesdeasis.com',
          'cata.png',
          'Cata is learning to trust again',
          'Gentle and calm; gaining confidence daily while receiving steady rescue care.',
          $story$Cata's story is one of quiet survival. She spent her early life without stability, often overlooked and struggling to find safety. But despite her difficult beginning, she remains incredibly sweet and gentle.

She loves calm spaces, soft beds, and the simple feeling of being protected. Every day she becomes a little more confident, a little more playful, and a little more trusting.

Your support helps cover her veterinary expenses, nutrition, and rescue care while she waits for the second chance she truly deserves.$story$,
          false, false, true, false, false, NULL, 420,
          '["Food", "Vaccination", "Shelter / Housing"]'::jsonb
        ),
        (
          'Chimichurri',
          'charlies.angels.costarica@gmail.com',
          'chimichurri.png',
          'Chimichurri is discovering that life can be safe',
          'Recovering from abandonment; affectionate once comfortable and needs ongoing medical follow-up.',
          $story$Chimichurri may be small, but her personality fills every room she enters. Rescued from abandonment, she arrived frightened and exhausted, unsure if humans would help her or hurt her.

Now she spends her days cuddled in blankets, slowly discovering that life can be safe and peaceful. She is affectionate, curious, and incredibly loving once she feels comfortable.

Donations help provide her with medical care, daily food, sterilization, and a path toward finding a forever family that will never abandon her again.$story$,
          false, true, true, false, false, NULL, 400,
          '["Spay/Neuter", "Medication", "Food"]'::jsonb
        ),
        (
          'Cleme',
          'info@ahppa.com',
          'cleme.png',
          'Cleme keeps healing with hopeful eyes',
          'Recovering from serious medical complications; requires ongoing treatment and monitoring.',
          $story$Cleme's journey has been painful. She was rescued while wearing a recovery cone after suffering medical complications that could have easily become life-threatening without intervention.

Even through discomfort and fear, Cleme never stopped trying to connect with people. She still greets rescuers with hopeful eyes and gentle affection, showing incredible emotional strength.

Your contribution helps fund her ongoing treatment, medications, recovery process, and the safe environment she needs to heal both physically and emotionally.$story$,
          true, true, true, false, false, NULL, 650,
          '["Surgery", "Medication", "Emergency Care"]'::jsonb
        ),
        (
          'Cocoa',
          'contact@halfwayhometamarindo.com',
          'cocoa.png',
          'Cocoa is rebuilding trust after severe injury',
          'Long-term rehabilitation after severe injury; improving slowly with intensive care.',
          $story$Cocoa knows what it feels like to suffer in silence. When she was rescued, she was severely injured and exhausted, needing urgent medical attention and intensive care.

Her recovery has been long, but her spirit never gave up. Slowly, she has started trusting again, enjoying affection, rest, and moments of peace she likely never experienced before rescue.

Donations to Cocoa's campaign directly support her rehabilitation, medical treatments, pain management, nutrition, and continued recovery journey.$story$,
          false, true, true, false, true,
          'Cocoa arrived with severe injuries requiring urgent and ongoing intensive medical care.',
          780,
          '["Emergency Care", "Medication", "Rehabilitation / Training"]'::jsonb
        ),
        (
          'Mulan',
          'contact@elrefugiocostaballena.com',
          'mulan.png',
          'Mulan is fighting her way back to strength',
          'Stabilizing after serious injury; needs daily veterinary support and recovery monitoring.',
          $story$Mulan arrived weak, injured, and emotionally drained after enduring extremely difficult conditions. She required immediate medical support and constant monitoring just to stabilize.

But even during recovery, Mulan showed remarkable strength. Every small improvement became a huge victory: standing up, eating again, relaxing beside caregivers, and finally feeling safe enough to sleep peacefully.

Your support helps cover her ongoing veterinary treatment, recovery supplies, medications, and the loving care she still needs every day.$story$,
          false, true, true, false, true,
          'Mulan needed immediate stabilization and continues to require close medical monitoring.',
          720,
          '["Emergency Care", "Medication", "Shelter / Housing"]'::jsonb
        ),
        (
          'Ramona',
          'nordicosdecostarica@gmail.com',
          'ramona.png',
          'Ramona brings joy wherever she goes',
          'Healthy and playful; preparing for adoption with routine veterinary care and sterilization.',
          $story$Ramona is pure happiness wrapped in a wagging tail. Despite having a difficult start in life, she still greets the world with excitement, affection, and endless love for people.

She was rescued after spending time vulnerable and unprotected, but her joyful personality never disappeared. Ramona quickly became a favorite among volunteers thanks to her playful and loving energy.

Donations help provide her with food, veterinary care, vaccinations, sterilization, and support while she waits for a family to finally call her own.$story$,
          false, true, false, true, false, NULL, 360,
          '["Vaccination", "Spay/Neuter", "Food"]'::jsonb
        ),
        (
          'Spencer',
          'info@territoriodezaguates.com',
          'spencer.png',
          'Spencer is learning that he is safe now',
          'Shy but loyal; progressing through emotional rehabilitation and basic medical care.',
          $story$Spencer's eyes tell a story of survival. He was rescued after enduring abandonment and uncertainty, spending too much time without proper care or safety.

Although shy at first, Spencer has slowly started showing his sweet and loyal personality. He enjoys calm affection, safe spaces, and being close to people who make him feel protected.

Your donation helps Spencer receive the care, rehabilitation, and stability he needs while we work toward finding him the loving forever home he deserves.$story$,
          false, false, true, false, false, NULL, 430,
          '["Rehabilitation / Training", "Food", "Shelter / Housing"]'::jsonb
        )
    ) AS seed(
      dog_name,
      provider_email,
      image_file,
      headline,
      current_condition,
      story,
      needs_surgery,
      medical_treatment,
      medical_recovery,
      ready_for_adoption,
      is_emergency,
      emergency_explanation,
      goal,
      funds_needed_for
    )
  LOOP
    SELECT id
    INTO provider_id
    FROM public.care_providers
    WHERE email = rec.provider_email
    LIMIT 1;

    IF provider_id IS NULL THEN
      RAISE NOTICE 'Skipping % — care provider not found: %', rec.dog_name, rec.provider_email;
      CONTINUE;
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public.dogs d
      WHERE d.care_provider_id = provider_id
        AND d.name = rec.dog_name
    ) THEN
      RAISE NOTICE 'Skipping % — already seeded', rec.dog_name;
      CONTINUE;
    END IF;

    INSERT INTO public.dogs (
      care_provider_id,
      name,
      story,
      current_condition,
      location,
      city,
      state,
      country,
      images,
      is_emergency,
      emergency_explanation,
      needs_surgery,
      medical_treatment,
      medical_recovery,
      ready_for_adoption,
      requester_type,
      headline
    )
    SELECT
      cp.id,
      rec.dog_name,
      rec.story,
      rec.current_condition,
      COALESCE(cp.location, cp.city || ', ' || cp.country),
      cp.city,
      cp.state,
      cp.country,
      ARRAY[
        'https://zxedwfyhrzptpwkgaiuq.supabase.co/storage/v1/object/public/dog-images/seed/' || rec.image_file
      ],
      rec.is_emergency,
      rec.emergency_explanation,
      rec.needs_surgery,
      rec.medical_treatment,
      rec.medical_recovery,
      rec.ready_for_adoption,
      INITCAP(cp.type),
      rec.headline
    FROM public.care_providers cp
    WHERE cp.id = provider_id
    RETURNING id INTO dog_id;

    INSERT INTO public.campaigns (
      dog_id,
      care_provider_id,
      dog_name,
      dog_image,
      headline,
      current_condition,
      funds_needed_for,
      goal,
      raised,
      spent,
      status
    )
    VALUES (
      dog_id,
      provider_id,
      rec.dog_name,
      'https://zxedwfyhrzptpwkgaiuq.supabase.co/storage/v1/object/public/dog-images/seed/' || rec.image_file,
      rec.headline,
      rec.current_condition,
      rec.funds_needed_for,
      rec.goal,
      0,
      0,
      'Active'
    );
  END LOOP;

  UPDATE public.care_providers cp
  SET dogs_helped = sub.total
  FROM (
    SELECT care_provider_id, COUNT(*) AS total
    FROM public.dogs
    GROUP BY care_provider_id
  ) sub
  WHERE cp.id = sub.care_provider_id;
END $$;
