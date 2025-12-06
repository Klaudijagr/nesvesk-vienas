import type { Id } from './_generated/dataModel';
import { internalMutation } from './_generated/server';

// Type alias for user IDs (keeps the import "used" according to linter)
type UserId = Id<'users'>;

// Type definitions matching schema (only types that are actually used)
type Language = 'Lithuanian' | 'English' | 'Ukrainian' | 'Russian';
type HolidayDate = '24 Dec' | '25 Dec' | '26 Dec' | '31 Dec';
type Concept = 'Party' | 'Dinner' | 'Hangout';

// Seed data for testing - 10 Lithuanian users
const seedUsers = [
  {
    name: 'Marius Kazlauskas',
    email: 'marius@test.lt',
    clerkId: 'seed_marius_001',
  },
  {
    name: 'Eglė Jonaitis',
    email: 'egle@test.lt',
    clerkId: 'seed_egle_002',
  },
  {
    name: 'Tomas Petrauskas',
    email: 'tomas@test.lt',
    clerkId: 'seed_tomas_003',
  },
  {
    name: 'Rūta Barkus',
    email: 'ruta@test.lt',
    clerkId: 'seed_ruta_004',
  },
  {
    name: 'Andrius Šimkus',
    email: 'andrius@test.lt',
    clerkId: 'seed_andrius_005',
  },
  {
    name: 'Gintarė Latvėnaitė',
    email: 'gintare@test.lt',
    clerkId: 'seed_gintare_006',
  },
  {
    name: 'Paulius Rimkus',
    email: 'paulius@test.lt',
    clerkId: 'seed_paulius_007',
  },
  {
    name: 'Simona Vaitkutė',
    email: 'simona@test.lt',
    clerkId: 'seed_simona_008',
  },
  {
    name: 'Jonas Norvilas',
    email: 'jonas@test.lt',
    clerkId: 'seed_jonas_009',
  },
  {
    name: 'Lina Mockutė',
    email: 'lina@test.lt',
    clerkId: 'seed_lina_010',
  },
];

const seedProfiles = [
  {
    role: 'host' as const,
    firstName: 'Marius',
    lastName: 'Kazlauskas',
    age: 35,
    city: 'Vilnius' as const,
    bio: 'Šeimos tėvas, mylintis Kalėdas! Turime didelį butą senamiestyje ir mėgstame priimti svečius. Mūsų durys visada atviros tiems, kurie neturi su kuo švęsti.',
    photoUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English'] as Language[],
    availableDates: ['24 Dec', '25 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: 'Dinner' as Concept,
    capacity: 6,
    preferredGuestAgeMin: 20,
    preferredGuestAgeMax: 60,
    amenities: ['Parking', 'WiFi', 'Kids friendly'],
    houseRules: ['No smoking inside', 'Pets welcome'],
    vibes: ['Family-friendly', 'Traditional', 'Cozy'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: 'guest' as const,
    firstName: 'Eglė',
    lastName: 'Jonaitis',
    age: 28,
    city: 'Vilnius' as const,
    bio: 'Studentė iš Ukrainos, studijuoju Vilniaus universitete. Šiais metais negaliu grįžti namo, tad ieškau šiltos kompanijos Kalėdoms. Moku gaminti ukrainietiškus patiekalus!',
    photoUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Ukrainian', 'Lithuanian', 'English'] as Language[],
    availableDates: ['24 Dec', '25 Dec', '31 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ['Friendly', 'Creative'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: 'host' as const,
    firstName: 'Tomas',
    lastName: 'Petrauskas',
    age: 42,
    city: 'Kaunas' as const,
    bio: 'IT specialistas, gyvenu vienas dideliame name. Kalėdos mano mėgstamiausia šventė, bet neturiu su kuo švęsti. Ieškau draugijos tradicinei Kūčių vakarienei.',
    photoUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English', 'Russian'] as Language[],
    availableDates: ['24 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: 'Dinner' as Concept,
    capacity: 4,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 55,
    amenities: ['Parking', 'WiFi', 'Garden'],
    houseRules: ['No smoking', 'Quiet after 11pm'],
    vibes: ['Traditional', 'Intellectual', 'Relaxed'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: true,
    isVisible: true,
  },
  {
    role: 'guest' as const,
    firstName: 'Rūta',
    lastName: 'Barkus',
    age: 67,
    city: 'Klaipėda' as const,
    bio: 'Pensinininkė, vaikai gyvena užsienyje. Labai pasiilgstu šeimyniškos atmosferos per šventes. Galiu pasidalinti senovinėmis lietuviškomis receptais!',
    photoUrl:
      'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face',
    verified: false,
    languages: ['Lithuanian', 'Russian'] as Language[],
    availableDates: ['24 Dec', '25 Dec'] as HolidayDate[],
    dietaryInfo: ['No spicy food'] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ['Traditional', 'Caring'],
    smokingAllowed: false,
    drinkingAllowed: false,
    petsAllowed: true,
    hasPets: false,
    isVisible: false, // Testing invisible profile
  },
  {
    role: 'both' as const,
    firstName: 'Andrius',
    lastName: 'Šimkus',
    age: 31,
    city: 'Vilnius' as const,
    bio: 'Jaunas profesionalas, persikėlęs į Vilnių dėl darbo. Galiu priimti svečius savo bute arba prisijungti prie kitų šventimo. Mėgstu žaidimus ir gerą bendravimą!',
    photoUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English'] as Language[],
    availableDates: ['25 Dec', '31 Dec'] as HolidayDate[],
    dietaryInfo: ['Vegetarian'] as string[],
    concept: 'Hangout' as Concept,
    capacity: 3,
    preferredGuestAgeMin: 20,
    preferredGuestAgeMax: 40,
    amenities: ['WiFi', 'Board games', 'PlayStation'],
    houseRules: ['BYOB', 'Music until midnight'],
    vibes: ['Fun', 'Casual', 'Gaming'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: false,
    isVisible: true,
  },
  {
    role: 'host' as const,
    firstName: 'Gintarė',
    lastName: 'Latvėnaitė',
    age: 45,
    city: 'Šiauliai' as const,
    bio: 'Mokytoja, auginu dvi dukras. Mūsų namai visada pilni juoko ir šilumos. Kviečiame prisijungti tuos, kurie neturi su kuo švęsti!',
    photoUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian'] as Language[],
    availableDates: ['24 Dec', '25 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    concept: 'Dinner' as Concept,
    capacity: 8,
    preferredGuestAgeMin: 0,
    preferredGuestAgeMax: 99,
    amenities: ['Parking', 'Kids friendly', 'Garden'],
    houseRules: ['Family atmosphere'],
    vibes: ['Family-friendly', 'Warm', 'Traditional'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: true,
    isVisible: true,
  },
  {
    role: 'guest' as const,
    firstName: 'Paulius',
    lastName: 'Rimkus',
    age: 24,
    city: 'Vilnius' as const,
    bio: 'Studentas medicinos, šiais metais lieku Vilniuje dėl praktikos. Ieškau šiltos kompanijos Naujųjų metų vakarui. Atnešiu šampano! 🥂',
    photoUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English'] as Language[],
    availableDates: ['31 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ['Fun', 'Outgoing', 'Social'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: true,
  },
  {
    role: 'host' as const,
    firstName: 'Simona',
    lastName: 'Vaitkutė',
    age: 38,
    city: 'Kaunas' as const,
    bio: 'Dailininkė, gyvenu erdviame loft tipe bute Kauno centre. Organizuoju kūrybingą Naujųjų metų šventę su menu ir pokalbiais apie kultūrą.',
    photoUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English', 'Russian'] as Language[],
    availableDates: ['31 Dec'] as HolidayDate[],
    dietaryInfo: ['Pescatarian'] as string[],
    concept: 'Party' as Concept,
    capacity: 12,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 50,
    amenities: ['WiFi', 'Art studio', 'Rooftop access'],
    houseRules: ['Creative dress code welcome', 'Bring your art!'],
    vibes: ['Creative', 'Artistic', 'Bohemian'],
    smokingAllowed: true,
    drinkingAllowed: true,
    petsAllowed: false,
    hasPets: false,
    isVisible: true,
  },
  {
    role: 'guest' as const,
    firstName: 'Jonas',
    lastName: 'Norvilas',
    age: 55,
    city: 'Panevėžys' as const,
    bio: 'Vienišius po skyrybų, vaikai su buvusia žmona. Pirmą kartą per daugelį metų švęsiu vienas. Ieškau draugiškos kompanijos, galiu padėti su maistu.',
    photoUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face',
    verified: false,
    languages: ['Lithuanian', 'Russian'] as Language[],
    availableDates: ['24 Dec', '25 Dec'] as HolidayDate[],
    dietaryInfo: [] as string[],
    amenities: [] as string[],
    houseRules: [] as string[],
    vibes: ['Friendly', 'Helpful', 'Traditional'] as string[],
    smokingAllowed: true,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: false,
    isVisible: false, // Another invisible profile for testing
  },
  {
    role: 'both' as const,
    firstName: 'Lina',
    lastName: 'Mockutė',
    age: 33,
    city: 'Vilnius' as const,
    bio: 'HR specialistė, aistringai myliu šventes ir naujas pažintis! Galiu priimti svečius mano jaukiame bute arba prisijungti prie kitų. Mėgstu žaidimus ir gerą maistą.',
    photoUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    verified: true,
    languages: ['Lithuanian', 'English'] as Language[],
    availableDates: ['24 Dec', '31 Dec'] as HolidayDate[],
    dietaryInfo: ['Gluten-free'] as string[],
    concept: 'Hangout' as Concept,
    capacity: 4,
    preferredGuestAgeMin: 25,
    preferredGuestAgeMax: 45,
    amenities: ['WiFi', 'Netflix', 'Board games'],
    houseRules: ['Cozy vibes only'],
    vibes: ['Cozy', 'Fun', 'Social'],
    smokingAllowed: false,
    drinkingAllowed: true,
    petsAllowed: true,
    hasPets: true,
    isVisible: true,
  },
];

// Seed the database
export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingUsers = await ctx.db.query('users').collect();
    const seedUserIds = seedUsers.map((u) => u.clerkId);
    const alreadySeeded = existingUsers.some((u) => seedUserIds.includes(u.clerkId));

    if (alreadySeeded) {
      return { message: 'Database already seeded', created: 0 };
    }

    const userIds: UserId[] = [];

    // Create users and profiles
    for (let i = 0; i < seedUsers.length; i++) {
      const userData = seedUsers[i];
      const profileData = seedProfiles[i];

      // Create user
      const userId = await ctx.db.insert('users', {
        clerkId: userData.clerkId,
        email: userData.email,
        name: userData.name,
        imageUrl: profileData.photoUrl,
      });

      userIds.push(userId);

      // Create profile
      await ctx.db.insert('profiles', {
        userId,
        ...profileData,
        lastActive: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
      });
    }

    // Create some invitations between users
    // Marius (host) invites Eglė (guest)
    await ctx.db.insert('invitations', {
      fromUserId: userIds[0],
      toUserId: userIds[1],
      status: 'accepted',
      date: '24 Dec',
    });

    // Eglė requests to join Gintarė's event
    await ctx.db.insert('invitations', {
      fromUserId: userIds[1],
      toUserId: userIds[5],
      status: 'pending',
      date: '25 Dec',
    });

    // Paulius requests to join Simona's party
    await ctx.db.insert('invitations', {
      fromUserId: userIds[6],
      toUserId: userIds[7],
      status: 'accepted',
      date: '31 Dec',
    });

    // Tomas invites Jonas
    await ctx.db.insert('invitations', {
      fromUserId: userIds[2],
      toUserId: userIds[8],
      status: 'pending',
      date: '24 Dec',
    });

    // Andrius invites Lina
    await ctx.db.insert('invitations', {
      fromUserId: userIds[4],
      toUserId: userIds[9],
      status: 'accepted',
      date: '31 Dec',
    });

    // Create some messages between matched users
    // Marius and Eglė conversation
    await ctx.db.insert('messages', {
      senderId: userIds[0],
      receiverId: userIds[1],
      content:
        'Labas Egle! Džiaugiuosi, kad prisijungsite prie mūsų Kūčių vakarienės. Ar turite kokių nors maisto alergijų ar pageidavimų?',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[1],
      receiverId: userIds[0],
      content:
        'Labas Mariau! Ačiū už kvietimą! Ne, jokių alergijų. Ar galiu atnešti ukrainietišką borsčą?',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[0],
      receiverId: userIds[1],
      content:
        'Būtų puiku! Vaikai labai laukia. Kūčios prasideda 18:00, adresą atsiųsiu artėjant datai.',
      read: true,
    });

    // Marius sends event card with details to Eglė
    await ctx.db.insert('messages', {
      senderId: userIds[0],
      receiverId: userIds[1],
      content: '📍 Shared event details',
      read: false,
      eventCard: {
        date: '24 Dec',
        address: 'Pilies g. 12-5, Vilnius',
        phone: '+370 612 34567',
        note: 'Įeikite per kiemą, 2 aukštas. Skambinkite, jei nerasite!',
      },
    });

    // Paulius and Simona conversation
    await ctx.db.insert('messages', {
      senderId: userIds[6],
      receiverId: userIds[7],
      content: 'Sveiki! Jūsų Naujųjų metų vakarėlis skamba fantastiški! Ar dar yra vietos?',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[7],
      receiverId: userIds[6],
      content:
        'Sveiki Pauliau! Taip, dar yra vietos. Tema šiais metais - "Aukso amžius". Dress code neprivalomas, bet skatinamas! 🎨',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[6],
      receiverId: userIds[7],
      content: 'Puiku! Tikrai ką nors sugalvosiu. Kur ir kada?',
      read: true,
    });

    // Simona sends event card with details to Paulius
    await ctx.db.insert('messages', {
      senderId: userIds[7],
      receiverId: userIds[6],
      content: '📍 Shared event details',
      read: false,
      eventCard: {
        date: '31 Dec',
        address: 'Laisvės al. 88, Kaunas (Loft studija, 4 aukštas)',
        phone: '+370 698 76543',
        note: 'Pradžia 21:00. Atnešk gerą nuotaiką ir šampano! 🥂',
      },
    });

    // Andrius and Lina conversation
    await ctx.db.insert('messages', {
      senderId: userIds[4],
      receiverId: userIds[9],
      content:
        'Labas Lina! Matau, kad tu irgi mėgsti stalo žaidimus. Gal norėtum prisijungti prie mano Naujųjų metų žaidimų vakaro?',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[9],
      receiverId: userIds[4],
      content: 'Labas Andriau! Skamba super! Kokius žaidimus planuoji?',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[4],
      receiverId: userIds[9],
      content:
        'Turiu Catan, Wingspan, Ticket to Ride ir daug kitų. Taip pat PS5 jei kas norės. Bus apie 4-5 žmonės.',
      read: true,
    });

    await ctx.db.insert('messages', {
      senderId: userIds[9],
      receiverId: userIds[4],
      content: 'Idealiai! Aš atnešiu savo Codenames ir kokį užkandį. Kas dar ateis?',
      read: true,
    });

    // Andrius sends event card with details to Lina
    await ctx.db.insert('messages', {
      senderId: userIds[4],
      receiverId: userIds[9],
      content: '📍 Shared event details',
      read: false,
      eventCard: {
        date: '31 Dec',
        address: 'Gedimino pr. 45-23, Vilnius',
        phone: '+370 655 11223',
        note: 'Nuo 19:00, atsidarom su Catan! Ateik alkana, bus picos.',
      },
    });

    return {
      message: 'Database seeded successfully',
      created: {
        users: 10,
        profiles: 10,
        invitations: 5,
        messages: 13, // includes 3 event card messages
      },
    };
  },
});

// Clear seed data (for development)
export const clearSeedData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const seedClerkIds = seedUsers.map((u) => u.clerkId);

    // Find all seed users
    const users = await ctx.db.query('users').collect();
    const seedUserRecords = users.filter((u) => seedClerkIds.includes(u.clerkId));
    const seedUserIds = seedUserRecords.map((u) => u._id);

    // Delete profiles
    for (const userId of seedUserIds) {
      const profile = await ctx.db
        .query('profiles')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .first();
      if (profile) {
        await ctx.db.delete(profile._id);
      }
    }

    // Delete messages
    const messages = await ctx.db.query('messages').collect();
    for (const msg of messages) {
      if (seedUserIds.includes(msg.senderId) || seedUserIds.includes(msg.receiverId)) {
        await ctx.db.delete(msg._id);
      }
    }

    // Delete invitations
    const invitations = await ctx.db.query('invitations').collect();
    for (const inv of invitations) {
      if (seedUserIds.includes(inv.fromUserId) || seedUserIds.includes(inv.toUserId)) {
        await ctx.db.delete(inv._id);
      }
    }

    // Delete users
    for (const user of seedUserRecords) {
      await ctx.db.delete(user._id);
    }

    return { message: 'Seed data cleared', deleted: seedUserRecords.length };
  },
});
