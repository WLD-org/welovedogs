-- Seed data for We Love Dogs application
-- This file can be run manually after creating test auth users
-- Or use it as a reference for what data to create

-- IMPORTANT: Before running this seed, you need to create auth users in Supabase Auth
-- Then update the auth_user_id values below with the actual user IDs

-- Example: Create auth users first via Supabase Dashboard or API:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create users with emails: sarah@example.com, info@hopeshelter.org, dr.chen@vetclinic.com
-- 3. Copy their user IDs and replace the placeholder UUIDs below

-- Insert sample care providers
-- Replace the auth_user_id values with real user IDs from Supabase Auth
INSERT INTO care_providers (
  id, auth_user_id, name, email, type, phone, city, country, location,
  about, story, stellar_address, profile_complete, dogs_helped, rating, created_at
) VALUES
('11111111-1111-1111-1111-111111111111', 
 (SELECT id FROM auth.users WHERE email = 'sarah@example.com' LIMIT 1),
 'Sarah Johnson', 'sarah@example.com', 'rescuer', '+1-555-0101', 'San Francisco', 'USA', 'San Francisco, USA', 
 'Passionate dog rescuer with 10 years of experience saving dogs from difficult situations.', 
 'My journey as a dog rescuer began when I found a stray dog on the side of the road. Since then, I have dedicated my life to helping dogs in need, providing them with medical care, shelter, and finding them loving homes.', 
 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', true, 2, 4.8, NOW() - INTERVAL '6 months')
ON CONFLICT (id) DO NOTHING;

INSERT INTO care_providers (
  id, auth_user_id, name, email, type, phone, city, country, location,
  about, story, stellar_address, profile_complete, dogs_helped, rating, created_at
) VALUES
('22222222-2222-2222-2222-222222222222',
 (SELECT id FROM auth.users WHERE email = 'info@hopeshelter.org' LIMIT 1),
 'Hope Animal Shelter', 'info@hopeshelter.org', 'shelter', '+1-555-0202', 'Los Angeles', 'USA', 'Los Angeles, USA',
 'A non-profit animal shelter dedicated to rescuing and rehoming dogs in need.',
 'Hope Animal Shelter was founded in 2015 with a mission to provide a safe haven for abandoned and abused dogs. We work tirelessly to rehabilitate dogs and find them permanent, loving homes. Our team of dedicated volunteers and staff care for over 50 dogs at any given time.',
 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', true, 1, 4.9, NOW() - INTERVAL '2 years')
ON CONFLICT (id) DO NOTHING;

INSERT INTO care_providers (
  id, auth_user_id, name, email, type, phone, city, country, location,
  about, story, stellar_address, profile_complete, dogs_helped, rating, created_at
) VALUES
('33333333-3333-3333-3333-333333333333',
 (SELECT id FROM auth.users WHERE email = 'dr.chen@vetclinic.com' LIMIT 1),
 'Dr. Michael Chen', 'dr.chen@vetclinic.com', 'veterinarian', '+1-555-0303', 'New York', 'USA', 'New York, USA',
 'Licensed veterinarian specializing in emergency care and surgery for rescue dogs.',
 'I became a veterinarian because I wanted to help animals in their most vulnerable moments. Over the years, I have worked with numerous rescue organizations, providing critical medical care to dogs who have been injured, neglected, or abused. There is nothing more rewarding than seeing a dog recover and thrive.',
 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', true, 1, 5.0, NOW() - INTERVAL '1 year')
ON CONFLICT (id) DO NOTHING;

-- Insert sample dogs
INSERT INTO dogs (id, care_provider_id, name, story, current_condition, location, city, state, country, images, is_emergency, needs_surgery, medical_treatment, medical_recovery, ready_for_adoption, requester_type, headline, created_at)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Buddy', 
 'Buddy was found abandoned in a park, malnourished and scared. He had been living on the streets for several months before being rescued. Despite his difficult past, Buddy is incredibly friendly and loves people. He is now recovering well and gaining weight, but needs ongoing medical care and a safe place to call home.',
 'Buddy is recovering from malnutrition and needs regular veterinary check-ups. He is responding well to treatment and gaining weight steadily.',
 'San Francisco, CA, USA', 'San Francisco', 'CA', 'USA', 
 ARRAY['https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800'],
 false, false, 'Regular veterinary check-ups, nutritional supplements, and medication for parasites.',
 'Buddy is making excellent progress. His weight has increased by 30% and he is much more energetic.', false, 'Rescuer', 'Buddy needs your help to find a forever home', NOW() - INTERVAL '2 months')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dogs (id, care_provider_id, name, story, current_condition, location, city, state, country, images, is_emergency, needs_surgery, medical_treatment, medical_recovery, ready_for_adoption, requester_type, headline, created_at)
VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Luna',
 'Luna was brought to our shelter after being hit by a car. She suffered a broken leg and internal injuries. Our veterinary team performed emergency surgery, and Luna is now on the road to recovery. She is a sweet, gentle dog who deserves a second chance at life.',
 'Luna is recovering from emergency surgery. She needs ongoing medical care, physical therapy, and a quiet place to heal.',
 'Los Angeles, CA, USA', 'Los Angeles', 'CA', 'USA',
 ARRAY['https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800'],
 true, true, 'Post-surgical care, pain management, physical therapy sessions, and follow-up X-rays.',
 'Luna''s surgery was successful. She is healing well but needs continued care and support.', false, 'Shelter', 'Luna needs emergency medical care', NOW() - INTERVAL '1 month')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dogs (id, care_provider_id, name, story, current_condition, location, city, state, country, images, is_emergency, needs_surgery, medical_treatment, medical_recovery, ready_for_adoption, requester_type, headline, created_at)
VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Max',
 'Max is a 3-year-old German Shepherd who was surrendered by his previous owner due to financial difficulties. Max has a severe hip dysplasia that requires corrective surgery. Without this surgery, Max will be in constant pain and may lose mobility. He is a wonderful, loyal dog who deserves to live a pain-free life.',
 'Max needs hip dysplasia surgery. He is currently on pain medication but requires surgical intervention to improve his quality of life.',
 'New York, NY, USA', 'New York', 'NY', 'USA',
 ARRAY['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'],
 false, true, 'Hip dysplasia corrective surgery, pre-operative testing, post-operative care, and rehabilitation.',
 'Max is stable but needs surgery soon. The procedure has a high success rate and will significantly improve his quality of life.', false, 'Veterinarian', 'Max needs life-changing surgery', NOW() - INTERVAL '3 weeks')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dogs (id, care_provider_id, name, story, current_condition, location, city, state, country, images, is_emergency, needs_surgery, medical_treatment, medical_recovery, ready_for_adoption, requester_type, headline, created_at)
VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Bella',
 'Bella was rescued from a hoarding situation where she lived with 20 other dogs in terrible conditions. She was severely underweight and had multiple health issues. After months of rehabilitation, Bella has made a remarkable recovery. She is now healthy, happy, and ready to find her forever home.',
 'Bella has fully recovered and is ready for adoption. She is healthy, vaccinated, and spayed.',
 'San Francisco, CA, USA', 'San Francisco', 'CA', 'USA',
 ARRAY['https://images.unsplash.com/photo-1534361960057-19889c938271?w=800'],
 false, false, 'Completed: Full medical check-up, vaccinations, spaying, and dental cleaning.',
 'Bella has made a full recovery! She is healthy, happy, and ready for her forever home.', true, 'Rescuer', 'Bella is ready for her forever home', NOW() - INTERVAL '4 months')
ON CONFLICT (id) DO NOTHING;

-- Insert sample campaigns
INSERT INTO campaigns (id, dog_id, care_provider_id, dog_name, dog_image, headline, current_condition, funds_needed_for, goal, raised, spent, status, stellar_address, created_at)
VALUES
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Luna', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800', 'Help Luna recover from emergency surgery', 'Luna is recovering from emergency surgery after being hit by a car.', '["Emergency Surgery", "Post-Surgical Care", "Physical Therapy", "Medications"]'::jsonb, 5000.00, 3200.00, 2800.00, 'Active', 'GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB', NOW() - INTERVAL '1 month')
ON CONFLICT (id) DO NOTHING;

INSERT INTO campaigns (id, dog_id, care_provider_id, dog_name, dog_image, headline, current_condition, funds_needed_for, goal, raised, spent, status, stellar_address, created_at)
VALUES
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Max', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800', 'Max needs hip dysplasia surgery', 'Max needs corrective surgery for severe hip dysplasia to live a pain-free life.', '["Surgery", "Pre-Operative Testing", "Post-Operative Care", "Rehabilitation"]'::jsonb, 8000.00, 1200.00, 0.00, 'Active', 'GCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC', NOW() - INTERVAL '3 weeks')
ON CONFLICT (id) DO NOTHING;

INSERT INTO campaigns (id, dog_id, care_provider_id, dog_name, dog_image, headline, current_condition, funds_needed_for, goal, raised, spent, status, stellar_address, created_at)
VALUES
('11111111-1111-1111-1111-111111111112', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Buddy', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'Help Buddy find a forever home', 'Buddy is recovering well and needs ongoing care until he finds his forever home.', '["Veterinary Care", "Food & Supplies", "Medications", "Foster Care"]'::jsonb, 2000.00, 1850.00, 1200.00, 'Active', 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', NOW() - INTERVAL '2 months')
ON CONFLICT (id) DO NOTHING;

-- Insert sample campaign updates
INSERT INTO campaign_updates (id, campaign_id, dog_id, title, description, image, created_at)
VALUES
('aaaaaaaa-0000-0000-0000-000000000011', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Luna''s Surgery Successful!', 'Great news! Luna''s emergency surgery was successful. She is now recovering in our care. The veterinary team is monitoring her closely, and she is responding well to treatment. Thank you to everyone who has supported Luna''s recovery!', 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800', NOW() - INTERVAL '3 weeks'),
('bbbbbbbb-0000-0000-0000-000000000022', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Max''s Pre-Surgery Update', 'Max has completed all pre-operative testing and is cleared for surgery. We have scheduled his hip dysplasia corrective surgery for next week. Your support is making this possible - thank you!', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800', NOW() - INTERVAL '1 week')
ON CONFLICT (id) DO NOTHING;

-- Insert sample campaign expenses
INSERT INTO campaign_expenses (id, campaign_id, title, description, amount, proof, created_at)
VALUES
('cccccccc-0000-0000-0000-000000000033', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Emergency Surgery', 'Emergency surgery for Luna after being hit by a car', 2500.00, 'https://example.com/proof/surgery-invoice.pdf', NOW() - INTERVAL '3 weeks'),
('dddddddd-0000-0000-0000-000000000044', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Post-Surgical Medications', 'Pain medications and antibiotics for post-surgical care', 300.00, 'https://example.com/proof/medications-receipt.pdf', NOW() - INTERVAL '2 weeks')
ON CONFLICT (id) DO NOTHING;

-- Insert sample quests
INSERT INTO quests (id, name, description, requirement_type, requirement_value, reward_type, reward_metadata, is_active, created_at)
VALUES
('eeeeeeee-0000-0000-0000-000000000055', 'First Donation', 'Make your first donation to help a dog in need', 'donations_count', 1.00, 'badge', '{"badge_name": "First Donor", "badge_icon": "🎁"}'::jsonb, true, NOW()),
('ffffffff-0000-0000-0000-000000000066', 'Hero Donor', 'Donate $100 or more to help dogs in need', 'donations_amount', 100.00, 'nft', '{"nft_name": "Hero Donor NFT", "nft_description": "Awarded to donors who contribute $100 or more"}'::jsonb, true, NOW()),
('11111111-0000-0000-0000-000000000077', 'Dog Supporter', 'Support 5 different dogs', 'dogs_supported', 5.00, 'title', '{"title": "Dog Supporter", "color": "purple"}'::jsonb, true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Update care provider stats
UPDATE care_providers
SET dogs_helped = (SELECT COUNT(*) FROM dogs WHERE care_provider_id = care_providers.id)
WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
