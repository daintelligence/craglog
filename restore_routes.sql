-- Ravensdale Main Wall
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'b8027a2f-cf23-4775-9bc4-dee97d9f20b9', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Pale Wall','HVS 5a',11,18,'A bold route up the pale limestone wall'),('Dogtooth','HS 4b',8,15,'On the dogtooth limestone features'),('Raven Groove','E3 5c',16,22,'A strenuous groove line'),('Jackdaw Crack','S 4a',6,14,'A fine crack with good gear'),('Grey Wall','E2 5b',14,20,'Technical route up the grey face')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='b8027a2f-cf23-4775-9bc4-dee97d9f20b9' AND name=r.name);

-- Ravensdale Left Wing
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), '9c21c77a-5a24-460f-87c9-a82cd747da93', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Feather Route','D',2,12,'Easy route on good holds'),('Wind Arete','S 4a',6,15,'Pleasant arete with good protection'),('Left Edge','VD',3,14,'Direct line up the left edge'),('Condor','E2 5b',14,18,'Bold direct line up the wall'),('Dove','HS 4b',8,16,'Classic route on the right side')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='9c21c77a-5a24-460f-87c9-a82cd747da93' AND name=r.name);

-- Raven Tor Main Wall
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'e23d4d30-11b4-44d3-854c-499d9a91bf93', r.name, r.grade, 'french'::"routes_gradesystem_enum", 'sport'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Statement of Youth','8a',22,22,'One of the first 8a routes in Britain'),('Zeke the Freak','8a',22,20,'Powerful route with ferocious crux'),('Cave Route Right','7c+',21,18,'Classic test-piece through the cave'),('Bat Route','7a+',17,16,'Excellent sustained climbing'),('Pump Fiction','7a+',17,18,'Sustained and pumpy on good holds'),('To Bolt or Not To Be','8c+',29,25,'The hardest route in Britain on first ascent')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='e23d4d30-11b4-44d3-854c-499d9a91bf93' AND name=r.name);

-- Water-cum-Jolly Harmony Wall
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'a6d5efae-d615-4e38-9fb6-89a629dd321c', r.name, r.grade, 'french'::"routes_gradesystem_enum", 'sport'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Ballad','6a+',11,14,'Pleasant warm-up on harmony wall'),('Chromatic','6b+',13,16,'Technical crux in the middle'),('Cadenza','7a',16,18,'Classic line up the main face'),('Resolution','7b+',19,20,'Powerful test-piece on steeper section'),('Syncopation','6c+',15,17,'Technical footwork on slabby section')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='a6d5efae-d615-4e38-9fb6-89a629dd321c' AND name=r.name);

-- Water-cum-Jolly Wall of Horrors
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'c630b8c1-630b-4281-93c6-e3cbd24d339f', r.name, r.grade, 'french'::"routes_gradesystem_enum", 'sport'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Sheer Terror','7a+',17,16,'Through the steepest section'),('Fear','7b',18,18,'Desperate crux on poor holds'),('Total Fear','8b',26,20,'Extreme test-piece on overhanging section'),('The Vice','7c',20,18,'Technical sustained through crimpy middle')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='c630b8c1-630b-4281-93c6-e3cbd24d339f' AND name=r.name);

-- Wimberry Rocks Main Edge
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), '6e426481-f2c8-433e-b9fd-d0cd6c7a3986', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Wimberry Crack','S 4a',6,10,'Classic gritstone crack'),('Gritstone Groove','HS 4b',8,12,'Solid groove on perfect gritstone'),('Moorland Wall','VS 4c',10,14,'Technical face climbing on compact wall'),('Heather Arete','VD',3,10,'Pleasant arete above the heather'),('Saddleworth Slab','E1 5b',12,15,'Bold slab on compact gritstone'),('Bilberry Wall','E2 5b',14,14,'Sustained technical route above Saddleworth')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='6e426481-f2c8-433e-b9fd-d0cd6c7a3986' AND name=r.name);

-- Wimberry Rocks Slab Area
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'd51b2d51-47d3-429b-bc4d-f50b8e26893f', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Slab Direct','VD',3,10,'Direct line up the centre'),('Slab Arete','S 4a',6,11,'Delicate arete on left side'),('Slab Crack','HS 4b',8,12,'Fine crack splitting the slab'),('Central Slab','VS 4c',10,14,'Technical balance climbing'),('Slab Wall','E1 5b',12,13,'Bold route on the right side')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='d51b2d51-47d3-429b-bc4d-f50b8e26893f' AND name=r.name);

-- Laddow Rocks Main Buttress
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), '96844765-e2f3-4a67-a3bb-81dfa7b6eb55', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Chimney Route','D',2,12,'Easy chimney for beginners'),('Laddow Wall','S 4a',6,15,'Pleasant route up the main wall'),('Corner Crack','HS 4b',8,14,'Good crack with excellent gear'),('Prow Route','E1 5b',12,18,'Bold route over the prow feature'),('Laddow Groove','E3 5c',16,20,'Serious sustained groove line')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='96844765-e2f3-4a67-a3bb-81dfa7b6eb55' AND name=r.name);

-- Laddow Rocks Left Wing
INSERT INTO routes (id, buttress_id, name, grade, "gradeSystem", "climbingType", "gradeDifficulty", "heightMetres", description)
SELECT gen_random_uuid(), 'd9fe9bfa-b176-4372-b45d-c78f13bf7cd5', r.name, r.grade, 'uk_trad'::"routes_gradesystem_enum", 'trad'::"routes_climbingtype_enum", r.diff, r.len, r.descr
FROM (VALUES ('Left Wall','VD',3,12,'Straightforward left wing wall route'),('Heather Slab','S 4a',6,10,'Gentle slab above the heather'),('Crack Climb','HS 4b',8,14,'Classic moorland crack'),('Left Arete','VS 4c',10,13,'Technical arete on left side'),('Laddow Left','E1 5b',12,15,'Sustained with bold finish')) AS r(name,grade,diff,len,descr)
WHERE NOT EXISTS (SELECT 1 FROM routes WHERE buttress_id='d9fe9bfa-b176-4372-b45d-c78f13bf7cd5' AND name=r.name);

SELECT COUNT(*) AS total_routes FROM routes;
