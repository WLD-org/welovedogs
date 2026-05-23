-- Seed Costa Rica shelters and rescuers into care_providers.
-- Creates placeholder auth.users rows required by the auth_user_id foreign key.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  rec RECORD;
  user_id UUID;
BEGIN
  FOR rec IN
    SELECT *
    FROM (
      VALUES
        (
          'Land of The Strays',
          'shelter'::text,
          4.6::numeric,
          '+506 8815-2514',
          'Santa Bárbara',
          'Heredia',
          'Costa Rica',
          'Santa Bárbara, Heredia',
          'info@territoriodezaguates.com',
          'https://territoriodezaguates.com',
          'Territorio de Zaguates',
          'Probablemente el refugio de perros más famoso de Costa Rica. También conocido como Territorio de Zaguates. Es un santuario no-kill con cientos de perros rescatados y programas de adopción.',
          'land-of-the-strays.png'
        ),
        (
          'Costa Rica Dog Rescue',
          'rescuer',
          4.9,
          '+506 8880-2999',
          'La Fortuna',
          'Alajuela',
          'Costa Rica',
          'La Fortuna, Alajuela',
          'contact@crdogrescue.com',
          'https://www.crdogrescue.com',
          NULL,
          'Rescatan perros callejeros, les dan tratamiento veterinario y ayudan con adopciones locales e internacionales. También aceptan voluntarios.',
          'costa-rica-dog-rescue.png'
        ),
        (
          'Animal Shelter Costa Rica',
          'shelter',
          4.6,
          '+506 2267-7158',
          'San Rafael',
          'Heredia',
          'Costa Rica',
          'San Rafael de Heredia',
          'info@ahppa.com',
          'https://ahppa.com',
          'AHPPA',
          'Conocido como AHPPA. Uno de los refugios históricos del país, enfocado en rescate, esterilización y adopción de perros y gatos.',
          'ahppa.png'
        ),
        (
          'Asociación Animales de Asís',
          'shelter',
          4.4,
          '+506 2267-6011',
          'Heredia',
          'Heredia',
          'Costa Rica',
          'Heredia',
          'info@animalesdeasis.com',
          'https://animalesdeasis.com',
          'Animales de Asís',
          'Santuario no-kill con más de 200 perros y gatos, muchos de ellos adultos mayores o con discapacidad.',
          'animales-de-asis.png'
        ),
        (
          'El Refugio Costa Ballena',
          'shelter',
          4.6,
          NULL,
          'Uvita',
          'Puntarenas',
          'Costa Rica',
          'Uvita, Puntarenas',
          'contact@elrefugiocostaballena.com',
          'https://www.elrefugiocostaballena.com',
          'El Refugio Costa Ballena',
          'Refugio enfocado en rescate y adopción de perros y gatos en la zona sur del Pacífico.',
          'el-refugio-costa-ballena.png'
        ),
        (
          'Halfway Home Tamarindo',
          'rescuer',
          4.9,
          '+506 8675-8118',
          'Tamarindo',
          'Guanacaste',
          'Costa Rica',
          'Tamarindo, Guanacaste',
          'contact@halfwayhometamarindo.com',
          'https://halfwayhometamarindo.com',
          NULL,
          'Muy conocido entre expatriados y turistas que adoptan perros rescatados. También trabajan foster y esterilización.',
          'halfway-home-tamarindo.png'
        ),
        (
          'Guayabo Animal Rescue',
          'rescuer',
          5.0,
          '+506 2673-0880',
          'Guayabo',
          'Guanacaste',
          'Costa Rica',
          'Guanacaste',
          'nicole@guayaboanimalrescue.org',
          'https://guayaboanimalrescue.org',
          'Guayabo Animal Rescue',
          'Santuario y organización enfocada en rescate, rehabilitación y campañas de castración.',
          'guayabo-animal-rescue.png'
        ),
        (
          'Fundación Nórdicos De Costa Rica',
          'shelter',
          4.0,
          '+506 6322-6120',
          'Guadalupe',
          'San José',
          'Costa Rica',
          'Guadalupe, San José',
          'nordicosdecostarica@gmail.com',
          NULL,
          'Fundación Nórdicos De Costa Rica',
          'Especializados en rescate de razas nórdicas y perros de alta energía abandonados.',
          'fundacion-nordicos-costa-rica.png'
        ),
        (
          'Charlie''s Angels Costa Rica',
          'rescuer',
          4.6,
          NULL,
          'Pérez Zeledón',
          'San José',
          'Costa Rica',
          'Pérez Zeledón',
          'charlies.angels.costarica@gmail.com',
          'https://www.charlies-angels-rescue.org',
          NULL,
          'Organización basada en foster homes que rescata perros y gatos y realiza campañas de esterilización.',
          'charlies-angels-costa-rica.png'
        ),
        (
          'Hope 4 A Street Dog',
          'rescuer',
          0,
          NULL,
          'Junquillal',
          'Guanacaste',
          'Costa Rica',
          'Junquillal, Guanacaste',
          'contact@hope4astreetdog.org',
          'https://hope4astreetdog.org',
          NULL,
          'ONG enfocada en perros callejeros, rescates y atención veterinaria urgente.',
          'hope-4-a-street-dog.png'
        )
    ) AS seed_data(
      name,
      provider_type,
      rating,
      phone,
      city,
      state,
      country,
      location,
      email,
      website,
      org_name,
      about,
      profile_logo_file
    )
  LOOP
    IF EXISTS (
      SELECT 1
      FROM public.care_providers
      WHERE email = rec.email
    ) THEN
      IF rec.profile_logo_file IS NOT NULL THEN
        UPDATE public.care_providers
        SET profile_photo =
          'https://zxedwfyhrzptpwkgaiuq.supabase.co/storage/v1/object/public/profile-photos/seed/care-providers/' || rec.profile_logo_file
        WHERE email = rec.email;
      END IF;
      CONTINUE;
    END IF;

    SELECT id
    INTO user_id
    FROM auth.users
    WHERE email = rec.email
    LIMIT 1;

    IF user_id IS NULL THEN
      user_id := gen_random_uuid();

      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        is_sso_user,
        is_anonymous
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        rec.email,
        crypt('seed-not-for-login', gen_salt('bf')),
        now(),
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"],"seed":true}'::jsonb,
        jsonb_build_object('seed', true, 'organization', rec.name),
        now(),
        now(),
        false,
        false
      );
    END IF;

    INSERT INTO public.care_providers (
      auth_user_id,
      name,
      email,
      type,
      phone,
      city,
      state,
      country,
      location,
      org_name,
      org_description,
      about,
      website,
      profile_photo,
      profile_complete,
      dogs_helped,
      rating
    )
    VALUES (
      user_id,
      rec.name,
      rec.email,
      rec.provider_type,
      rec.phone,
      rec.city,
      rec.state,
      rec.country,
      rec.location,
      rec.org_name,
      rec.about,
      rec.about,
      rec.website,
      CASE
        WHEN rec.profile_logo_file IS NULL THEN NULL
        ELSE 'https://zxedwfyhrzptpwkgaiuq.supabase.co/storage/v1/object/public/profile-photos/seed/care-providers/' || rec.profile_logo_file
      END,
      true,
      0,
      CASE WHEN rec.rating = 0 THEN 0 ELSE rec.rating END
    );
  END LOOP;
END $$;
