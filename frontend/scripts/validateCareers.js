#!/usr/bin/env node
// frontend/scripts/validateCareers.js

const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '..', '..'); // ../.. from frontend/scripts

// Helper to pick the first existing path
function resolveFirst(relPaths, label) {
    for (const rel of relPaths) {
        const abs = path.join(repoRoot, rel);
        if (fs.existsSync(abs)) {
            return abs;
        }
    }
    console.error(`❌ Missing ${label}. Tried:\n  - ${relPaths.map(r => path.join(repoRoot, r)).join('\n  - ')}`);
    process.exit(1);
}

const quizDataPath = resolveFirst(
    ['backend/data/enhancedThreeLevelQuizData.js'],
    'enhancedThreeLevelQuizData.js'
);

const clubServicePath = resolveFirst(
    ['backend/services/ClubRecommendationService.js'],
    'ClubRecommendationService.js'
);

const clubsPath = resolveFirst(
    ['backend/seedClubs.js', 'backend/seedClubs.js'],
    'seedClubs.js'
);

function safeRequire(p) {
    try {
        return require(p);
    } catch (e) {
        console.error(`❌ Cannot require: ${p}`);
        console.error(e.stack || e.message);
        process.exit(1);
    }
}

const { enhancedCareerOptions } = safeRequire(quizDataPath);

// Get the career club mappings from the service
const ClubRecommendationService = safeRequire(clubServicePath);
const serviceInstance = new ClubRecommendationService();
const careerClubMap = serviceInstance.directMappings;

// Get clubs data
const seedClubsModule = safeRequire(clubsPath);
const clubsArray = seedClubsModule.clubData || seedClubsModule;

if (!Array.isArray(clubsArray)) {
    console.error('❌ seedClubs.js did not export clubData array properly.');
    process.exit(1);
}

const clubNames = new Set(clubsArray.map(c => c.name));

// ---- Validation ----
let errors = [];
let warnings = [];

const uniqueCareers = new Set(enhancedCareerOptions);
if (enhancedCareerOptions.length !== 55) {
    errors.push(`Expected 55 careers, found ${enhancedCareerOptions.length}.`);
}
if (uniqueCareers.size !== enhancedCareerOptions.length) {
    const dupes = enhancedCareerOptions.filter((c, i, a) => a.indexOf(c) !== i);
    errors.push(`Duplicate careers detected: ${[...new Set(dupes)].join(', ')}`);
}

const missingMappings = [];
const emptyMappings = [];
const invalidClubRefs = [];

for (const career of enhancedCareerOptions) {
    const clubs = careerClubMap[career];
    if (!clubs) {
        missingMappings.push(career);
        continue;
    }
    if (!Array.isArray(clubs) || clubs.length === 0) {
        emptyMappings.push(career);
        continue;
    }
    const bad = clubs.filter(n => !clubNames.has(n));
    if (bad.length) {
        invalidClubRefs.push({ career, bad });
    }
}

const extraKeys = Object.keys(careerClubMap).filter(k => !uniqueCareers.has(k));

// ---- Report ----
console.log('========================================');
console.log(' Career & Club Mapping Validation Report ');
console.log('========================================\n');
console.log(`Using:
  quiz data: ${quizDataPath}
  club svc:  ${clubServicePath}
  clubs:     ${clubsPath}\n`);

console.log(`Careers in enhancedCareerOptions: ${enhancedCareerOptions.length}`);
console.log(`Unique careers:                   ${uniqueCareers.size}`);
console.log(`Clubs in seedClubs:               ${clubNames.size}\n`);

if (extraKeys.length) {
    warnings.push(`careerClubMap has extra keys not in enhancedCareerOptions: ${extraKeys.join(', ')}`);
}

if (missingMappings.length) {
    console.log('⚠️  Careers missing club mappings:');
    missingMappings.forEach(career => console.log(`  - ${career}`));
    console.log('');
}

if (emptyMappings.length) {
    errors.push(`Empty/invalid club list for: ${emptyMappings.join(', ')}`);
}

if (invalidClubRefs.length) {
    console.log('❌ Invalid club references:');
    for (const { career, bad } of invalidClubRefs) {
        console.log(`  Career "${career}" references unknown club(s): ${bad.join(', ')}`);
    }
    console.log('');
}

if (warnings.length) {
    console.log('⚠️  WARNINGS:');
    for (const w of warnings) console.log('  - ' + w);
    console.log('');
}

if (errors.length) {
    console.log('❌ ERRORS:');
    for (const e of errors) console.log('  - ' + e);
    console.log('\nValidation failed.\n');
    process.exitCode = 1;
} else if (missingMappings.length || invalidClubRefs.length) {
    console.log('⚠️  Validation completed with warnings. Fix the issues above.\n');
    process.exitCode = 1;
} else {
    console.log('✅ All checks passed. Your career-to-club mapping looks good!\n');
}

// Show summary
console.log('📊 Summary:');
console.log(`  - Total careers: ${enhancedCareerOptions.length}`);
console.log(`  - Mapped careers: ${enhancedCareerOptions.length - missingMappings.length}`);
console.log(`  - Unmapped careers: ${missingMappings.length}`);
console.log(`  - Invalid club references: ${invalidClubRefs.reduce((sum, item) => sum + item.bad.length, 0)}`);